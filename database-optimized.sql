-- Optimized Database Schema for Zeina Real Estate
-- Enhanced with proper indexing, security, and performance optimizations

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search optimization

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS property_views CASCADE;
DROP TABLE IF EXISTS property_inquiries CASCADE;

-- Create optimized properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(15,2) NOT NULL CHECK (price >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'LBP')),
    location VARCHAR(255) NOT NULL,
    governorate VARCHAR(100) NOT NULL CHECK (governorate IN ('Beirut', 'Mount Lebanon', 'North Lebanon', 'South Lebanon', 'Bekaa', 'Nabatieh', 'Akkar')),
    area DECIMAL(10,2) NOT NULL CHECK (area > 0),
    bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
    bathrooms INTEGER NOT NULL CHECK (bathrooms >= 0),
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('apartment', 'house', 'villa', 'commercial', 'land')),
    status VARCHAR(20) NOT NULL DEFAULT 'for_sale' CHECK (status IN ('for_sale', 'for_rent', 'sold', 'rented')),
    images TEXT[] DEFAULT '{}',
    videos TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255) NOT NULL CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    is_featured BOOLEAN DEFAULT false,
    contact_for_price BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Add constraints
    CONSTRAINT valid_phone CHECK (contact_phone ~* '^\+961[0-9\s]+$'),
    CONSTRAINT valid_images CHECK (array_length(images, 1) IS NULL OR array_length(images, 1) <= 20),
    CONSTRAINT valid_videos CHECK (array_length(videos, 1) IS NULL OR array_length(videos, 1) <= 5)
);

-- Create admin users table with enhanced security
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    permissions TEXT[] DEFAULT '{"read", "write", "delete"}',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property views tracking table
CREATE TABLE property_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    user_ip INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id VARCHAR(255)
);

-- Create property inquiries table
CREATE TABLE property_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone VARCHAR(20),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'interested', 'not_interested')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create optimized indexes for better performance
CREATE INDEX CONCURRENTLY idx_properties_status ON properties(status);
CREATE INDEX CONCURRENTLY idx_properties_type ON properties(property_type);
CREATE INDEX CONCURRENTLY idx_properties_governorate ON properties(governorate);
CREATE INDEX CONCURRENTLY idx_properties_price ON properties(price);
CREATE INDEX CONCURRENTLY idx_properties_featured ON properties(is_featured) WHERE is_featured = true;
CREATE INDEX CONCURRENTLY idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX CONCURRENTLY idx_properties_location_gin ON properties USING gin(location gin_trgm_ops);
CREATE INDEX CONCURRENTLY idx_properties_title_gin ON properties USING gin(title gin_trgm_ops);
CREATE INDEX CONCURRENTLY idx_properties_description_gin ON properties USING gin(description gin_trgm_ops);

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY idx_properties_status_type ON properties(status, property_type);
CREATE INDEX CONCURRENTLY idx_properties_governorate_status ON properties(governorate, status);
CREATE INDEX CONCURRENTLY idx_properties_price_range ON properties(price) WHERE status IN ('for_sale', 'for_rent');

-- Indexes for admin users
CREATE INDEX CONCURRENTLY idx_admin_users_email ON admin_users(email);
CREATE INDEX CONCURRENTLY idx_admin_users_active ON admin_users(is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_admin_users_role ON admin_users(role);

-- Indexes for analytics
CREATE INDEX CONCURRENTLY idx_property_views_property_id ON property_views(property_id);
CREATE INDEX CONCURRENTLY idx_property_views_date ON property_views(viewed_at DESC);
CREATE INDEX CONCURRENTLY idx_inquiries_property_id ON property_inquiries(property_id);
CREATE INDEX CONCURRENTLY idx_inquiries_status ON property_inquiries(status);
CREATE INDEX CONCURRENTLY idx_inquiries_date ON property_inquiries(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON property_inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_property_view_count(property_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE properties 
    SET view_count = view_count + 1 
    WHERE id = property_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Row Level Security (RLS) Policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;

-- Properties policies
CREATE POLICY "Properties are viewable by everyone" ON properties
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated admins can insert properties" ON properties
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

CREATE POLICY "Only authenticated admins can update properties" ON properties
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

CREATE POLICY "Only authenticated admins can delete properties" ON properties
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- Admin users policies
CREATE POLICY "Admins can view admin users" ON admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- Property views policies
CREATE POLICY "Anyone can insert property views" ON property_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view property views" ON property_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- Property inquiries policies
CREATE POLICY "Anyone can insert inquiries" ON property_inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view inquiries" ON property_inquiries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

CREATE POLICY "Only admins can update inquiries" ON property_inquiries
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- Create function for secure property search
CREATE OR REPLACE FUNCTION search_properties(
    search_term TEXT DEFAULT '',
    property_type_filter TEXT DEFAULT NULL,
    governorate_filter TEXT DEFAULT NULL,
    min_price DECIMAL DEFAULT NULL,
    max_price DECIMAL DEFAULT NULL,
    status_filter TEXT DEFAULT 'for_sale'
)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    description TEXT,
    price DECIMAL(15,2),
    currency VARCHAR(3),
    location VARCHAR(255),
    governorate VARCHAR(100),
    area DECIMAL(10,2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    property_type VARCHAR(50),
    status VARCHAR(20),
    images TEXT[],
    is_featured BOOLEAN,
    contact_for_price BOOLEAN,
    view_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id, p.title, p.description, p.price, p.currency,
        p.location, p.governorate, p.area, p.bedrooms, p.bathrooms,
        p.property_type, p.status, p.images, p.is_featured,
        p.contact_for_price, p.view_count, p.created_at
    FROM properties p
    WHERE 
        (search_term = '' OR (
            p.title ILIKE '%' || search_term || '%' OR
            p.description ILIKE '%' || search_term || '%' OR
            p.location ILIKE '%' || search_term || '%'
        ))
        AND (property_type_filter IS NULL OR p.property_type = property_type_filter)
        AND (governorate_filter IS NULL OR p.governorate = governorate_filter)
        AND (min_price IS NULL OR p.price >= min_price)
        AND (max_price IS NULL OR p.price <= max_price)
        AND p.status = status_filter
    ORDER BY 
        p.is_featured DESC,
        p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for property analytics
CREATE OR REPLACE FUNCTION get_property_analytics(property_uuid UUID)
RETURNS TABLE (
    total_views BIGINT,
    unique_views BIGINT,
    total_inquiries BIGINT,
    last_viewed TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(pv.id) as total_views,
        COUNT(DISTINCT pv.user_ip) as unique_views,
        COUNT(pi.id) as total_inquiries,
        MAX(pv.viewed_at) as last_viewed
    FROM properties p
    LEFT JOIN property_views pv ON p.id = pv.property_id
    LEFT JOIN property_inquiries pi ON p.id = pi.property_id
    WHERE p.id = property_uuid
    GROUP BY p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample admin user (replace with actual admin email)
INSERT INTO admin_users (user_id, email, role, permissions) 
VALUES (
    (SELECT id FROM auth.users WHERE email = 'zeinasleiman@hotmail.com' LIMIT 1),
    'zeinasleiman@hotmail.com',
    'super_admin',
    '{"read", "write", "delete", "admin"}'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample properties with optimized data
INSERT INTO properties (
    title, description, price, currency, location, governorate, area, bedrooms, bathrooms,
    property_type, status, images, features, contact_phone, contact_email, is_featured
) VALUES 
(
    'Modern Apartment in Beirut',
    'Beautiful modern apartment in the heart of Beirut with stunning city views. Features premium finishes, and access to building amenities.',
    250000,
    'USD',
    'Hamra, Beirut',
    'Beirut',
    120.5,
    2,
    2,
    'apartment',
    'for_sale',
    ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    ARRAY['City View', 'Modern Kitchen', 'Balcony', 'Parking'],
    '+961 1 340 101',
    'zeinasleiman@hotmail.com',
    true
),
(
    'Luxury Villa in Mount Lebanon',
    'Spacious luxury villa with private garden and pool. Perfect for families seeking tranquility while staying close to the city.',
    450000,
    'USD',
    'Broummana, Mount Lebanon',
    'Mount Lebanon',
    300.0,
    4,
    3,
    'villa',
    'for_sale',
    ARRAY['https://example.com/villa1.jpg', 'https://example.com/villa2.jpg'],
    ARRAY['Private Pool', 'Garden', 'Mountain View', 'Parking', 'Security'],
    '+961 4 340 101',
    'zeinasleiman@hotmail.com',
    true
),
(
    'Commercial Space in Hamra',
    'Prime commercial space in Hamra district, perfect for retail or office use. High foot traffic area with excellent visibility.',
    120000,
    'USD',
    'Hamra Street, Beirut',
    'Beirut',
    80.0,
    0,
    1,
    'commercial',
    'for_sale',
    ARRAY['https://example.com/commercial1.jpg'],
    ARRAY['High Foot Traffic', 'Street Front', 'Modern Design'],
    '+961 1 340 101',
    'zeinasleiman@hotmail.com',
    false
);

-- Create backup function
CREATE OR REPLACE FUNCTION backup_properties()
RETURNS TABLE (
    backup_id UUID,
    backup_date TIMESTAMP WITH TIME ZONE,
    total_properties BIGINT
) AS $$
DECLARE
    backup_uuid UUID := uuid_generate_v4();
    property_count BIGINT;
BEGIN
    -- Count properties
    SELECT COUNT(*) INTO property_count FROM properties;
    
    -- Create backup table
    EXECUTE format('CREATE TABLE properties_backup_%s AS SELECT * FROM properties', backup_uuid);
    
    RETURN QUERY SELECT backup_uuid, NOW(), property_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON properties TO authenticated;
GRANT ALL ON admin_users TO authenticated;
GRANT ALL ON property_views TO authenticated;
GRANT ALL ON property_inquiries TO authenticated;
GRANT EXECUTE ON FUNCTION search_properties TO authenticated;
GRANT EXECUTE ON FUNCTION get_property_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION increment_property_view_count TO authenticated;
GRANT EXECUTE ON FUNCTION backup_properties TO authenticated;
