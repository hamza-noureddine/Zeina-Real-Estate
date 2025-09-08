-- Make property columns nullable for different property types
-- Run this in your Supabase SQL editor

-- Make bedrooms nullable (land doesn't need bedrooms)
ALTER TABLE properties ALTER COLUMN bedrooms DROP NOT NULL;

-- Make bathrooms nullable (land doesn't need bathrooms)  
ALTER TABLE properties ALTER COLUMN bathrooms DROP NOT NULL;

-- Make area nullable (some properties might not have area specified)
ALTER TABLE properties ALTER COLUMN area DROP NOT NULL;

-- Make price nullable (contact for price option)
ALTER TABLE properties ALTER COLUMN price DROP NOT NULL;

-- Update existing rows to have default values where needed
UPDATE properties SET bedrooms = 0 WHERE bedrooms IS NULL;
UPDATE properties SET bathrooms = 0 WHERE bathrooms IS NULL;
UPDATE properties SET area = 0 WHERE area IS NULL;
UPDATE properties SET price = 0 WHERE price IS NULL;
