-- Enable Row Level Security
-- Note: JWT secret is automatically managed by Supabase

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  location TEXT NOT NULL,
  area DECIMAL(8,2) NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'villa', 'commercial', 'land')),
  status TEXT NOT NULL DEFAULT 'for_sale' CHECK (status IN ('for_sale', 'for_rent', 'sold', 'rented')),
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for properties table
CREATE TRIGGER update_properties_updated_at 
  BEFORE UPDATE ON properties 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for properties (public read access)
CREATE POLICY "Properties are viewable by everyone" ON properties
  FOR SELECT USING (true);

-- Create policies for admin_users (only authenticated users can read)
CREATE POLICY "Admin users are viewable by authenticated users" ON admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies for properties (only authenticated users can insert/update/delete)
CREATE POLICY "Properties are insertable by authenticated users" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Properties are updatable by authenticated users" ON properties
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Properties are deletable by authenticated users" ON properties
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);

-- Insert sample admin user (replace with your actual email)
INSERT INTO admin_users (email, name) 
VALUES ('zeinasleiman@hotmail.com', 'Zeina Sleiman')
ON CONFLICT (email) DO NOTHING;

-- Insert sample properties
INSERT INTO properties (
  title, description, price, currency, location, area, bedrooms, bathrooms, 
  property_type, status, images, features, contact_phone, contact_email, is_featured
) VALUES 
(
  'Modern Apartment in Beirut',
  'Beautiful modern apartment in the heart of Beirut with stunning city views. Features open-plan living, premium finishes, and access to building amenities.',
  250000,
  'USD',
  'Beirut, Lebanon',
  120,
  2,
  2,
  'apartment',
  'for_sale',
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800'],
  ARRAY['City views', 'Modern kitchen', 'Balcony', 'Building gym', 'Parking'],
  '+961 76 340 101',
  'zeinasleiman@hotmail.com',
  true
),
(
  'Luxury Villa in Mount Lebanon',
  'Spacious luxury villa with private garden and pool. Perfect for families seeking tranquility while staying close to the city.',
  450000,
  'USD',
  'Mount Lebanon, Lebanon',
  300,
  4,
  3,
  'villa',
  'for_sale',
  ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
  ARRAY['Private pool', 'Garden', 'Mountain views', 'Garage', 'Fireplace'],
  '+961 76 340 101',
  'zeinasleiman@hotmail.com',
  true
),
(
  'Commercial Space in Hamra',
  'Prime commercial space in Hamra district, perfect for retail or office use. High foot traffic area with excellent visibility.',
  120000,
  'USD',
  'Hamra, Beirut',
  80,
  0,
  1,
  'commercial',
  'for_sale',
  ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'],
  ARRAY['High foot traffic', 'Street frontage', 'Parking available', 'Air conditioning'],
  '+961 76 340 101',
  'zeinasleiman@hotmail.com',
  false
);
