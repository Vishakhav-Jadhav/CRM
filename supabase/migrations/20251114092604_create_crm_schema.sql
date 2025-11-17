/*
  # CRM Database Schema

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text)
      - `position` (text)
      - `company_id` (uuid, foreign key)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `companies`
      - `id` (uuid, primary key)
      - `name` (text)
      - `industry` (text)
      - `website` (text)
      - `phone` (text)
      - `address` (text)
      - `city` (text)
      - `country` (text)
      - `logo_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `opportunities`
      - `id` (uuid, primary key)
      - `title` (text)
      - `company_id` (uuid, foreign key)
      - `contact_id` (uuid, foreign key)
      - `amount` (numeric)
      - `forecast_amount` (numeric)
      - `status` (text)
      - `sector` (text)
      - `priority` (text)
      - `probability` (integer)
      - `close_date` (date)
      - `owner` (text)
      - `description` (text)
      - `competitors` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `activities`
      - `id` (uuid, primary key)
      - `type` (text)
      - `title` (text)
      - `description` (text)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `status` (text)
      - `contact_id` (uuid, foreign key)
      - `company_id` (uuid, foreign key)
      - `opportunity_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `expenses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `amount` (numeric)
      - `category` (text)
      - `date` (date)
      - `opportunity_id` (uuid, foreign key)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `settings`
      - `id` (uuid, primary key)
      - `user_name` (text)
      - `user_email` (text)
      - `user_avatar` (text)
      - `sectors` (jsonb)
      - `activity_types` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  website text,
  phone text,
  address text,
  city text,
  country text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  position text,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  amount numeric DEFAULT 0,
  forecast_amount numeric DEFAULT 0,
  status text DEFAULT 'lead',
  sector text,
  priority text DEFAULT 'medium',
  probability integer DEFAULT 0,
  close_date date,
  owner text,
  description text,
  competitors jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  status text DEFAULT 'scheduled',
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  amount numeric NOT NULL,
  category text,
  date date DEFAULT CURRENT_DATE,
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE CASCADE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text DEFAULT 'User',
  user_email text,
  user_avatar text,
  sectors jsonb DEFAULT '["Technology", "Finance", "Healthcare", "Retail", "Manufacturing"]'::jsonb,
  activity_types jsonb DEFAULT '["Call", "Email", "Meeting", "Visit"]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on companies"
  ON companies FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on contacts"
  ON contacts FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on opportunities"
  ON opportunities FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on activities"
  ON activities FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on expenses"
  ON expenses FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on settings"
  ON settings FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_company_id ON opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_contact_id ON opportunities(contact_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_activities_contact_id ON activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_activities_company_id ON activities(company_id);
CREATE INDEX IF NOT EXISTS idx_activities_opportunity_id ON activities(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_activities_start_time ON activities(start_time);
CREATE INDEX IF NOT EXISTS idx_expenses_opportunity_id ON expenses(opportunity_id);
