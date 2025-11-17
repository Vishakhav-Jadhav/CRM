-- Add lead-related columns to opportunities table
ALTER TABLE opportunities
ADD COLUMN IF NOT EXISTS is_lead boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS lead_status text,
ADD COLUMN IF NOT EXISTS lead_temperature text;

-- Create index for is_lead
CREATE INDEX IF NOT EXISTS idx_opportunities_is_lead ON opportunities(is_lead);