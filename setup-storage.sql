-- Setup Supabase Storage for property images and videos
-- Run this in your Supabase SQL editor

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('property-images', 'property-images', true),
  ('property-videos', 'property-videos', true);

-- Set up RLS policies for property-images bucket
CREATE POLICY "Public read access for property images" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update property images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'property-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete property images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'property-images' 
    AND auth.role() = 'authenticated'
  );

-- Set up RLS policies for property-videos bucket
CREATE POLICY "Public read access for property videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-videos');

CREATE POLICY "Authenticated users can upload property videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-videos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update property videos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'property-videos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete property videos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'property-videos' 
    AND auth.role() = 'authenticated'
  );
