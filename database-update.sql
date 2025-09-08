-- Add missing columns to properties table
-- Run this in your Supabase SQL Editor

-- Add videos column (array of text)
ALTER TABLE properties ADD COLUMN IF NOT EXISTS videos TEXT[] DEFAULT '{}';

-- Add images column (array of text) - in case it's missing
ALTER TABLE properties ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add contact_for_price column (boolean)
ALTER TABLE properties ADD COLUMN IF NOT EXISTS contact_for_price BOOLEAN DEFAULT false;

-- Update existing properties to have empty arrays for videos if they don't have them
UPDATE properties SET videos = '{}' WHERE videos IS NULL;
UPDATE properties SET images = '{}' WHERE images IS NULL;
UPDATE properties SET contact_for_price = false WHERE contact_for_price IS NULL;
