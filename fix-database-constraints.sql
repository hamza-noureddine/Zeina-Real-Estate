-- Fix database constraints for nullable property fields
-- Run this in your Supabase SQL editor

-- First, update existing rows to have default values where needed
UPDATE properties 
SET bedrooms = 0 
WHERE bedrooms IS NULL;

UPDATE properties 
SET bathrooms = 0 
WHERE bathrooms IS NULL;

UPDATE properties 
SET area = 0 
WHERE area IS NULL;

UPDATE properties 
SET price = 0 
WHERE price IS NULL;

-- Now make the columns nullable
ALTER TABLE properties ALTER COLUMN bedrooms DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN bathrooms DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN area DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN price DROP NOT NULL;

-- Add default values for new rows
ALTER TABLE properties ALTER COLUMN bedrooms SET DEFAULT 0;
ALTER TABLE properties ALTER COLUMN bathrooms SET DEFAULT 0;
ALTER TABLE properties ALTER COLUMN area SET DEFAULT 0;
ALTER TABLE properties ALTER COLUMN price SET DEFAULT 0;

-- Verify the changes
SELECT column_name, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND column_name IN ('bedrooms', 'bathrooms', 'area', 'price');
