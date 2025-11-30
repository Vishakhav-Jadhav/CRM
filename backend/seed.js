const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Company = require('./models/Company');
const Contact = require('./models/Contact');
const Opportunity = require('./models/Opportunity');
const Activity = require('./models/Activity');
const Expense = require('./models/Expense');
const Lead = require('./models/Lead');

const DUMMY_COMPANIES = [
  { name: 'TechCorp Solutions', industry: 'Technology', website: 'https://techcorp.com', phone: '+1-555-0101' },
  { name: 'Green Energy Inc', industry: 'Energy', website: 'https://greenenergy.com', phone: '+1-555-0102' },
  { name: 'HealthCare Plus', industry: 'Healthcare', website: 'https://healthcareplus.com', phone: '+1-555-0103' },
  { name: 'Financial Services Ltd', industry: 'Finance', website: 'https://financial.com', phone: '+1-555-0104' },
  { name: 'Global Manufacturing', industry: 'Manufacturing', website: 'https://globalmfg.com', phone: '+1-555-0105' },
  { name: 'EduTech Academy', industry: 'Education', website: 'https://edutech.com', phone: '+1-555-0106' },
  { name: 'RetailMax Stores', industry: 'Retail', website: 'https://retailmax.com', phone: '+1-555-0107' },
  { name: 'MediaWorks Productions', industry: 'Media', website: 'https://mediaworks.com', phone: '+1-555-0108' },
  { name: 'Startup Hub', industry: 'Technology', website: 'https://startup.com', phone: '+1-555-0109' },
  { name: 'MegaCorp Enterprise', industry: 'Multinational', website: 'https://megacorp.com', phone: '+1-555-0110' }
];

const DUMMY_CONTACTS = [
  { first_name: 'John', last_name: 'Anderson', email: 'john.anderson@techcorp.com', phone: '+1-555-1001', position: 'Software Engineer' },
  { first_name: 'Sarah', last_name: 'Chen', email: 'sarah.chen@techcorp.com', phone: '+1-555-1002', position: 'Product Manager' },
  { first_name: 'Emma', last_name: 'Davis', email: 'emma.davis@greenenergy.com', phone: '+1-555-2001', position: 'Project Manager' },
  { first_name: 'Mike', last_name: 'Johnson', email: 'mike.johnson@healthcare.com', phone: '+1-555-3001', position: 'Medical Director' },
  { first_name: 'Lisa', last_name: 'Thompson', email: 'lisa.thompson@finance.com', phone: '+1-555-4001', position: 'Financial Analyst' }
];

const DUMMY_OPPORTUNITIES = [
  {
    title: 'Enterprise Software License',
    amount: 150000,
    forecast_amount: 150000,
    status: 'qualified',
    sector: 'Technology',
    priority: 'high',
    probability: 75,
    close_date: '2025-02-15',
    owner: 'Sales Team',
    description: 'Large enterprise software deployment'
  },
  {
    title: 'Solar Panel Installation',
    amount: 75000,
    forecast_amount: 75000,
    status: 'proposal',
    sector: 'Energy',
    priority: 'medium',
    probability: 60,
    close_date: '2025-03-01',
    owner: 'Sales Team',
    description: 'Commercial solar panel installation project'
  },
  {
    title: 'Medical Equipment Supply',
    amount: 200000,
    forecast_amount: 180000,
    status: 'negotiation',
    sector: 'Healthcare',
    priority: 'high',
    probability: 80,
    close_date: '2025-01-30',
    owner: 'Sales Team',
    description: 'Supply of advanced medical equipment'
  },
  {
    title: 'Financial Software Implementation',
    amount: 50000,
    forecast_amount: 50000,
    status: 'won',
    sector: 'Finance',
    priority: 'medium',
    probability: 100,
    close_date: '2024-12-20',
    owner: 'Sales Team',
    description: 'Complete financial management system implementation'
  }
];

const DUMMY_ACTIVITIES = [
  {
    title: 'Follow up on proposal',
    description: 'Call to discuss proposal details',
    type: 'call',
    start_time: '2025-11-15T10:00:00Z',
    end_time: '2025-11-15T10:30:00Z',
    status: 'scheduled'
  },
  {
    title: 'Send contract for review',
    description: 'Email contract for final review',
    type: 'email',
    start_time: '2025-11-14T14:00:00Z',
    end_time: '2025-11-14T14:15:00Z',
    status: 'completed'
  }
];

const DUMMY_LEADS = [
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@startup.com',
    phone: '+1-555-0125',
    company: 'Startup Hub',
    lead_status: 'Hot',
    forecast: 'High',
    value: 50000,
    source: 'Website',
    notes: 'Very interested in our enterprise solution'
  },
  {
    name: 'Bob Wilson',
    email: 'bob.wilson@consulting.com',
    phone: '+1-555-0126',
    company: 'Consulting Pro',
    lead_status: 'Warm',
    forecast: 'Medium',
    value: 25000,
    source: 'Referral',
    notes: 'Needs more information about pricing'
  },
  {
    name: 'Carol Davis',
    email: 'carol.davis@retailmax.com',
    phone: '+1-555-0127',
    company: 'RetailMax Stores',
    lead_status: 'Cold',
    forecast: 'Low',
    value: 15000,
    source: 'LinkedIn',
    notes: 'Initial contact, need to follow up'
  }
];

const DUMMY_EXPENSES = [
  { description: 'Office Supplies', amount: 250.00, category: 'Office', date: '2024-11-01' },
  { description: 'Client Lunch', amount: 120.50, category: 'Meals', date: '2024-11-02' },
  { description: 'Software License', amount: 99.99, category: 'Software', date: '2024-11-03' }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crm');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Company.deleteMany({});
    await Contact.deleteMany({});
    await Opportunity.deleteMany({});
    await Activity.deleteMany({});
    await Expense.deleteMany({});
    await Lead.deleteMany({});

    // Create default user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = new User({
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword
    });
    await user.save();
    console.log('Created demo user: demo@example.com / password123');

    // Create companies
    const companies = await Company.insertMany(DUMMY_COMPANIES);
    console.log(`Created ${companies.length} companies`);

    // Create contacts with company references
    const contactsWithCompanies = DUMMY_CONTACTS.map((contact, index) => ({
      ...contact,
      company_id: companies[index % companies.length]._id
    }));
    const contacts = await Contact.insertMany(contactsWithCompanies);
    console.log(`Created ${contacts.length} contacts`);

    // Create opportunities with company and contact references
    const opportunitiesWithRefs = DUMMY_OPPORTUNITIES.map((opp, index) => ({
      ...opp,
      company_id: companies[index % companies.length]._id,
      contact_id: contacts[index % contacts.length]._id
    }));
    const opportunities = await Opportunity.insertMany(opportunitiesWithRefs);
    console.log(`Created ${opportunities.length} opportunities`);

    // Create activities with company and contact references
    const activitiesWithRefs = DUMMY_ACTIVITIES.map((activity, index) => ({
      ...activity,
      company_id: companies[index % companies.length]._id,
      contact_id: contacts[index % contacts.length]._id
    }));
    const activities = await Activity.insertMany(activitiesWithRefs);
    console.log(`Created ${activities.length} activities`);

    // Create leads
    const leads = await Lead.insertMany(DUMMY_LEADS);
    console.log(`Created ${leads.length} leads`);

    // Create expenses
    const expenses = await Expense.insertMany(DUMMY_EXPENSES);
    console.log(`Created ${expenses.length} expenses`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();