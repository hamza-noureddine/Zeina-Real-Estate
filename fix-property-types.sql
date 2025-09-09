-- Fix property types constraint to include all supported types
-- Run this in your Supabase SQL editor

-- First, drop the existing constraint
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_property_type_check;

-- Add the new constraint with all supported property types
ALTER TABLE properties ADD CONSTRAINT properties_property_type_check 
CHECK (property_type IN ('apartment', 'villa', 'building', 'hotel', 'office', 'land'));

-- Also fix the status constraint to make sure it's correct
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;

ALTER TABLE properties ADD CONSTRAINT properties_status_check 
CHECK (status IN ('for_sale', 'for_rent', 'sold', 'rented'));

-- Verify the constraints
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'properties'::regclass 
AND contype = 'c';
