-- Seed data for CRM database
-- This script provides sample data to test the contact management functionality

-- Insert sample companies first (as contacts reference companies)
INSERT INTO companies (name, industry, website, phone, address, city, country) VALUES
('TechCorp Solutions', 'Technology', 'https://techcorp.com', '+1-555-0101', '123 Innovation Dr', 'San Francisco', 'USA'),
('Green Energy Inc', 'Energy', 'https://greenenergy.com', '+1-555-0102', '456 Solar Way', 'Austin', 'USA'),
('HealthCare Plus', 'Healthcare', 'https://healthcareplus.com', '+1-555-0103', '789 Medical Ave', 'Boston', 'USA'),
('Financial Services Ltd', 'Finance', 'https://financial.com', '+1-555-0104', '321 Money St', 'New York', 'USA'),
('Global Manufacturing', 'Manufacturing', 'https://globalmfg.com', '+1-555-0105', '654 Factory Rd', 'Detroit', 'USA'),
('EduTech Academy', 'Education', 'https://edutech.com', '+1-555-0106', '987 Learning Ln', 'Seattle', 'USA'),
('RetailMax Stores', 'Retail', 'https://retailmax.com', '+1-555-0107', '147 Shopping Blvd', 'Chicago', 'USA'),
('MediaWorks Productions', 'Media', 'https://mediaworks.com', '+1-555-0108', '258 Content Ct', 'Los Angeles', 'USA');

-- Insert sample contacts
INSERT INTO contacts (first_name, last_name, email, phone, position, company_id) VALUES
-- TechCorp Solutions contacts
('John', 'Anderson', 'john.anderson@techcorp.com', '+1-555-1001', 'Software Engineer', (SELECT id FROM companies WHERE name = 'TechCorp Solutions' LIMIT 1)),
('Sarah', 'Chen', 'sarah.chen@techcorp.com', '+1-555-1002', 'Product Manager', (SELECT id FROM companies WHERE name = 'TechCorp Solutions' LIMIT 1)),
('Mike', 'Johnson', 'mike.johnson@techcorp.com', '+1-555-1003', 'Senior Developer', (SELECT id FROM companies WHERE name = 'TechCorp Solutions' LIMIT 1)),

-- Green Energy Inc contacts
('Emma', 'Davis', 'emma.davis@greenenergy.com', '+1-555-2001', 'Project Manager', (SELECT id FROM companies WHERE name = 'Green Energy Inc' LIMIT 1)),
('David', 'Wilson', 'david.wilson@greenenergy.com', '+1-555-2002', 'Renewable Energy Specialist', (SELECT id FROM companies WHERE name = 'Green Energy Inc' LIMIT 1)),

-- HealthCare Plus contacts
('Lisa', 'Thompson', 'lisa.thompson@healthcareplus.com', '+1-555-3001', 'Medical Director', (SELECT id FROM companies WHERE name = 'HealthCare Plus' LIMIT 1)),
('Robert', 'Martinez', 'robert.martinez@healthcareplus.com', '+1-555-3002', 'Healthcare Consultant', (SELECT id FROM companies WHERE name = 'HealthCare Plus' LIMIT 1)),

-- Financial Services Ltd contacts
('Jennifer', 'Garcia', 'jennifer.garcia@financial.com', '+1-555-4001', 'Financial Analyst', (SELECT id FROM companies WHERE name = 'Financial Services Ltd' LIMIT 1)),
('Christopher', 'Brown', 'chris.brown@financial.com', '+1-555-4002', 'Investment Manager', (SELECT id FROM companies WHERE name = 'Financial Services Ltd' LIMIT 1)),

-- Global Manufacturing contacts
('Amanda', 'Miller', 'amanda.miller@globalmfg.com', '+1-555-5001', 'Operations Manager', (SELECT id FROM companies WHERE name = 'Global Manufacturing' LIMIT 1)),
('James', 'Rodriguez', 'james.rodriguez@globalmfg.com', '+1-555-5002', 'Quality Control Specialist', (SELECT id FROM companies WHERE name = 'Global Manufacturing' LIMIT 1)),

-- EduTech Academy contacts
('Michelle', 'Lee', 'michelle.lee@edutech.com', '+1-555-6001', 'Education Coordinator', (SELECT id FROM companies WHERE name = 'EduTech Academy' LIMIT 1)),

-- RetailMax Stores contacts
('Kevin', 'White', 'kevin.white@retailmax.com', '+1-555-7001', 'Store Manager', (SELECT id FROM companies WHERE name = 'RetailMax Stores' LIMIT 1)),

-- MediaWorks Productions contacts
('Rachel', 'Harris', 'rachel.harris@mediaworks.com', '+1-555-8001', 'Content Producer', (SELECT id FROM companies WHERE name = 'MediaWorks Productions' LIMIT 1)),

-- Additional contacts without companies (for testing)
('Alex', 'Taylor', 'alex.taylor@email.com', '+1-555-9001', 'Freelancer', NULL),
('Maria', 'Clark', 'maria.clark@email.com', '+1-555-9002', 'Consultant', NULL),
('Daniel', 'Lewis', 'daniel.lewis@email.com', '+1-555-9003', 'Independent', NULL);

-- Insert sample opportunities
INSERT INTO opportunities (title, company_id, contact_id, amount, forecast_amount, status, sector, priority, probability, close_date, owner, description) VALUES
('Enterprise Software License', (SELECT id FROM companies WHERE name = 'TechCorp Solutions' LIMIT 1), (SELECT id FROM contacts WHERE email = 'sarah.chen@techcorp.com' LIMIT 1), 50000, 45000, 'proposal', 'Technology', 'high', 75, '2024-12-31', 'Sales Team', 'Selling enterprise software licenses to TechCorp Solutions'),

('Solar Panel Installation', (SELECT id FROM companies WHERE name = 'Green Energy Inc' LIMIT 1), (SELECT id FROM contacts WHERE email = 'emma.davis@greenenergy.com' LIMIT 1), 25000, 22000, 'qualified', 'Energy', 'high', 60, '2024-11-15', 'Energy Sales', 'Large-scale solar panel installation project'),

('Healthcare Management System', (SELECT id FROM companies WHERE name = 'HealthCare Plus' LIMIT 1), (SELECT id FROM contacts WHERE email = 'lisa.thompson@healthcareplus.com' LIMIT 1), 75000, 70000, 'negotiation', 'Healthcare', 'high', 80, '2024-10-30', 'Healthcare Sales', 'Comprehensive healthcare management system implementation'),

('Investment Portfolio Management', (SELECT id FROM companies WHERE name = 'Financial Services Ltd' LIMIT 1), (SELECT id FROM contacts WHERE email = 'jennifer.garcia@financial.com' LIMIT 1), 100000, 90000, 'lead', 'Finance', 'medium', 40, '2025-01-15', 'Finance Team', 'Advanced investment portfolio management solution'),

('Manufacturing Equipment Upgrade', (SELECT id FROM companies WHERE name = 'Global Manufacturing' LIMIT 1), (SELECT id FROM contacts WHERE email = 'amanda.miller@globalmfg.com' LIMIT 1), 150000, 130000, 'qualified', 'Manufacturing', 'high', 70, '2024-12-15', 'Manufacturing Sales', 'Upgrading manufacturing equipment with automation'),

('Online Learning Platform', (SELECT id FROM companies WHERE name = 'EduTech Academy' LIMIT 1), (SELECT id FROM contacts WHERE email = 'michelle.lee@edutech.com' LIMIT 1), 35000, 32000, 'proposal', 'Education', 'medium', 65, '2024-11-30', 'Education Sales', 'Custom online learning platform development'),

('Retail Analytics Solution', (SELECT id FROM companies WHERE name = 'RetailMax Stores' LIMIT 1), (SELECT id FROM contacts WHERE email = 'kevin.white@retailmax.com' LIMIT 1), 20000, 18000, 'lead', 'Retail', 'medium', 50, '2024-12-31', 'Retail Sales', 'Advanced retail analytics and reporting solution'),

('Media Production Tools', (SELECT id FROM companies WHERE name = 'MediaWorks Productions' LIMIT 1), (SELECT id FROM contacts WHERE email = 'rachel.harris@mediaworks.com' LIMIT 1), 40000, 35000, 'qualified', 'Media', 'medium', 60, '2024-11-20', 'Media Sales', 'Professional media production and editing tools');

-- Insert sample activities
INSERT INTO activities (type, title, description, start_time, status, contact_id, company_id, opportunity_id) VALUES
('Call', 'Follow-up Call with TechCorp', 'Discuss technical requirements for enterprise license', '2024-10-15 14:00:00', 'scheduled', (SELECT id FROM contacts WHERE email = 'john.anderson@techcorp.com' LIMIT 1), (SELECT id FROM companies WHERE name = 'TechCorp Solutions' LIMIT 1), (SELECT id FROM opportunities WHERE title = 'Enterprise Software License' LIMIT 1)),

('Meeting', 'Site Visit - Green Energy', 'Visit solar installation site for assessment', '2024-10-16 10:00:00', 'scheduled', (SELECT id FROM contacts WHERE email = 'emma.davis@greenenergy.com' LIMIT 1), (SELECT id FROM companies WHERE name = 'Green Energy Inc' LIMIT 1), (SELECT id FROM opportunities WHERE title = 'Solar Panel Installation' LIMIT 1)),

('Email', 'Healthcare Demo Follow-up', 'Send proposal and demo materials for healthcare system', '2024-10-14 09:00:00', 'completed', (SELECT id FROM contacts WHERE email = 'lisa.thompson@healthcareplus.com' LIMIT 1), (SELECT id FROM companies WHERE name = 'HealthCare Plus' LIMIT 1), (SELECT id FROM opportunities WHERE title = 'Healthcare Management System' LIMIT 1)),

('Call', 'Financial Services Proposal Call', 'Present investment management solution proposal', '2024-10-17 15:00:00', 'scheduled', (SELECT id FROM contacts WHERE email = 'jennifer.garcia@financial.com' LIMIT 1), (SELECT id FROM companies WHERE name = 'Financial Services Ltd' LIMIT 1), (SELECT id FROM opportunities WHERE title = 'Investment Portfolio Management' LIMIT 1)),

('Meeting', 'Manufacturing Equipment Demo', 'Live demonstration of automation equipment', '2024-10-18 11:00:00', 'scheduled', (SELECT id FROM contacts WHERE email = 'amanda.miller@globalmfg.com' LIMIT 1), (SELECT id FROM companies WHERE name = 'Global Manufacturing' LIMIT 1), (SELECT id FROM opportunities WHERE title = 'Manufacturing Equipment Upgrade' LIMIT 1));

-- Insert sample expenses
INSERT INTO expenses (title, amount, category, date, opportunity_id, description) VALUES
('Travel Expenses - TechCorp Meeting', 450.00, 'Travel', '2024-10-10', (SELECT id FROM opportunities WHERE title = 'Enterprise Software License' LIMIT 1), 'Flight and accommodation for client meeting'),
('Site Visit - Green Energy', 320.00, 'Travel', '2024-10-11', (SELECT id FROM opportunities WHERE title = 'Solar Panel Installation' LIMIT 1), 'Transportation and accommodation for site assessment'),
('Healthcare Demo Materials', 180.00, 'Marketing', '2024-10-12', (SELECT id FROM opportunities WHERE title = 'Healthcare Management System' LIMIT 1), 'Printed materials and demo equipment'),
('Proposal Development - Financial Services', 250.00, 'Marketing', '2024-10-13', (SELECT id FROM opportunities WHERE title = 'Investment Portfolio Management' LIMIT 1), 'Professional proposal creation and design'),
('Manufacturing Demo Setup', 520.00, 'Operations', '2024-10-14', (SELECT id FROM opportunities WHERE title = 'Manufacturing Equipment Upgrade' LIMIT 1), 'Equipment rental and setup for demonstration');

-- Insert sample settings
INSERT INTO settings (user_name, user_email, user_avatar, sectors, activity_types) VALUES
('CRM Admin', 'admin@crm.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 
 '["Technology", "Energy", "Healthcare", "Finance", "Manufacturing", "Education", "Retail", "Media"]'::jsonb,
 '["Call", "Email", "Meeting", "Visit", "Demo", "Follow-up", "Presentation"]'::jsonb);