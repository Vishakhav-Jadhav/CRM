-- Update companies table to match new structure
ALTER TABLE companies
DROP COLUMN IF EXISTS industry,
DROP COLUMN IF EXISTS phone,
DROP COLUMN IF EXISTS address,
DROP COLUMN IF EXISTS city,
DROP COLUMN IF EXISTS country;

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS place_of_office text,
ADD COLUMN IF NOT EXISTS head_office text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS poc jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS sector text,
ADD COLUMN IF NOT EXISTS address jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS contacts jsonb DEFAULT '[]'::jsonb;