-- Add dummy companies for testing
INSERT INTO companies (name, industry, website, phone, address, city, country) VALUES
('TechCorp Solutions', 'Technology', 'https://techcorp.com', '+1-555-0101', '123 Innovation Dr', 'San Francisco', 'USA'),
('Green Energy Inc', 'Energy', 'https://greenenergy.com', '+1-555-0102', '456 Solar Way', 'Austin', 'USA'),
('HealthCare Plus', 'Healthcare', 'https://healthcareplus.com', '+1-555-0103', '789 Medical Ave', 'Boston', 'USA'),
('Financial Services Ltd', 'Finance', 'https://financial.com', '+1-555-0104', '321 Money St', 'New York', 'USA'),
('Global Manufacturing', 'Manufacturing', 'https://globalmfg.com', '+1-555-0105', '654 Factory Rd', 'Detroit', 'USA'),
('EduTech Academy', 'Education', 'https://edutech.com', '+1-555-0106', '987 Learning Ln', 'Seattle', 'USA'),
('RetailMax Stores', 'Retail', 'https://retailmax.com', '+1-555-0107', '147 Shopping Blvd', 'Chicago', 'USA'),
('MediaWorks Productions', 'Media', 'https://mediaworks.com', '+1-555-0108', '258 Content Ct', 'Los Angeles', 'USA'),
('Startup Hub', 'Technology', 'https://startup.com', '+1-555-0109', '789 Innovation St', 'Austin', 'USA'),
('MegaCorp Enterprise', 'Multinational', 'https://megacorp.com', '+1-555-0110', '1000 Corporate Blvd', 'New York', 'USA')
ON CONFLICT (name) DO NOTHING;