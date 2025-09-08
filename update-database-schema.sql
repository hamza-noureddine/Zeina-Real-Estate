-- Update database schema to support all property types
-- Run this in your Supabase SQL editor

-- Add new columns for different property types
ALTER TABLE properties ADD COLUMN IF NOT EXISTS floor INTEGER DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS floors INTEGER DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS parking INTEGER DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS view TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS land_area DECIMAL DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS building_area DECIMAL DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS apartments INTEGER DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS total_area DECIMAL DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS rooms INTEGER DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS studios INTEGER DEFAULT 0;

-- Update existing rows to have default values
UPDATE properties SET floor = 0 WHERE floor IS NULL;
UPDATE properties SET floors = 0 WHERE floors IS NULL;
UPDATE properties SET parking = 0 WHERE parking IS NULL;
UPDATE properties SET land_area = 0 WHERE land_area IS NULL;
UPDATE properties SET building_area = 0 WHERE building_area IS NULL;
UPDATE properties SET apartments = 0 WHERE apartments IS NULL;
UPDATE properties SET total_area = 0 WHERE total_area IS NULL;
UPDATE properties SET rooms = 0 WHERE rooms IS NULL;
UPDATE properties SET studios = 0 WHERE studios IS NULL;

-- Make all new columns nullable with defaults
ALTER TABLE properties ALTER COLUMN floor DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN floors DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN parking DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN view DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN land_area DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN building_area DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN apartments DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN total_area DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN rooms DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN studios DROP NOT NULL;

-- Set default values for new columns
ALTER TABLE properties ALTER COLUMN floor SET DEFAULT 0;
ALTER TABLE properties ALTER COLUMN floors SET DEFAULT 0;
ALTER TABLE properties ALTER COLUMN parking SET DEFAULT 0;
ALTER TABLE properties ALTER COLUMN land_area SET DEFAULT 0;
ALTER TABLE properties ALTER COLUMN building_area SET DEFAULT 0;
ALTER TABLE properties ALTER COLUMN apartments SET DEFAULT 0;
ALTER TABLE properties ALTER COLUMN total_area SET DEFAULT 0;
ALTER TABLE properties ALTER COLUMN rooms SET DEFAULT 0;
ALTER TABLE properties ALTER COLUMN studios SET DEFAULT 0;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND column_name IN ('floor', 'floors', 'parking', 'view', 'land_area', 'building_area', 'apartments', 'total_area', 'rooms', 'studios')
ORDER BY column_name;
