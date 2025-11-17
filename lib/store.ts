import { create } from 'zustand';
import { supabase } from './supabase';
import type { Contact, Company, Opportunity, Activity, Expense, Settings, Lead } from '@/types';

interface CRMStore {
  contacts: Contact[];
  companies: Company[];
  opportunities: Opportunity[];
  activities: Activity[];
  expenses: Expense[];
  settings: Settings | null;
  loading: boolean;
  subscriptions: Record<string, any>; // Store subscription objects for cleanup

  // LEADS
  leads: Lead[];
  fetchLeads: () => Promise<void>;
  addLead: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateLead: (id: string, lead: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;

  fetchContacts: () => Promise<void>;
  fetchCompanies: () => Promise<void>;
  fetchOpportunities: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  fetchExpenses: () => Promise<void>;
  fetchSettings: () => Promise<void>;

  // Real-time subscriptions
  subscribeToRealtime: () => void;
  unsubscribeFromRealtime: () => void;

  addContact: (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;

  addCompany: (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;

  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateOpportunity: (id: string, opportunity: Partial<Opportunity>) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;

  addActivity: (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;

  addExpense: (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  updateSettings: (settings: Partial<Settings>) => Promise<void>;

  importData: (data: { contacts?: Contact[]; companies?: Company[]; opportunities?: Opportunity[]; leads?: Lead[] }) => Promise<void>;
}

// Dummy companies for testing when database is not available
const DUMMY_COMPANIES: Company[] = [
  { id: '1', name: 'TechCorp Solutions', industry: 'Technology', website: 'https://techcorp.com', phone: '+1-555-0101', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Green Energy Inc', industry: 'Energy', website: 'https://greenenergy.com', phone: '+1-555-0102', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '3', name: 'HealthCare Plus', industry: 'Healthcare', website: 'https://healthcareplus.com', phone: '+1-555-0103', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '4', name: 'Financial Services Ltd', industry: 'Finance', website: 'https://financial.com', phone: '+1-555-0104', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '5', name: 'Global Manufacturing', industry: 'Manufacturing', website: 'https://globalmfg.com', phone: '+1-555-0105', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '6', name: 'EduTech Academy', industry: 'Education', website: 'https://edutech.com', phone: '+1-555-0106', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '7', name: 'RetailMax Stores', industry: 'Retail', website: 'https://retailmax.com', phone: '+1-555-0107', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '8', name: 'MediaWorks Productions', industry: 'Media', website: 'https://mediaworks.com', phone: '+1-555-0108', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '9', name: 'Startup Hub', industry: 'Technology', website: 'https://startup.com', phone: '+1-555-0109', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '10', name: 'MegaCorp Enterprise', industry: 'Multinational', website: 'https://megacorp.com', phone: '+1-555-0110', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
];

// Dummy contacts for testing
const DUMMY_CONTACTS: Contact[] = [
  { 
    id: '1', 
    first_name: 'John', 
    last_name: 'Anderson', 
    email: 'john.anderson@techcorp.com', 
    phone: '+1-555-1001', 
    position: 'Software Engineer',
    company_id: '1',
    company: DUMMY_COMPANIES[0],
    created_at: '2024-01-01T00:00:00Z', 
    updated_at: '2024-01-01T00:00:00Z' 
  },
  { 
    id: '2', 
    first_name: 'Sarah', 
    last_name: 'Chen', 
    email: 'sarah.chen@techcorp.com', 
    phone: '+1-555-1002', 
    position: 'Product Manager',
    company_id: '1',
    company: DUMMY_COMPANIES[0],
    created_at: '2024-01-01T00:00:00Z', 
    updated_at: '2024-01-01T00:00:00Z' 
  },
  { 
    id: '3', 
    first_name: 'Emma', 
    last_name: 'Davis', 
    email: 'emma.davis@greenenergy.com', 
    phone: '+1-555-2001', 
    position: 'Project Manager',
    company_id: '2',
    company: DUMMY_COMPANIES[1],
    created_at: '2024-01-01T00:00:00Z', 
    updated_at: '2024-01-01T00:00:00Z' 
  },
  { 
    id: '4', 
    first_name: 'Mike', 
    last_name: 'Johnson', 
    email: 'mike.johnson@healthcare.com', 
    phone: '+1-555-3001', 
    position: 'Medical Director',
    company_id: '3',
    company: DUMMY_COMPANIES[2],
    created_at: '2024-01-01T00:00:00Z', 
    updated_at: '2024-01-01T00:00:00Z' 
  },
  { 
    id: '5', 
    first_name: 'Lisa', 
    last_name: 'Thompson', 
    email: 'lisa.thompson@finance.com', 
    phone: '+1-555-4001', 
    position: 'Financial Analyst',
    company_id: '4',
    company: DUMMY_COMPANIES[3],
    created_at: '2024-01-01T00:00:00Z', 
    updated_at: '2024-01-01T00:00:00Z' 
  }
];

// Dummy opportunities for more dynamic dashboard
const DUMMY_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Enterprise Software License',
    company_id: '1',
    contact_id: '1',
    amount: 150000,
    forecast_amount: 150000,
    status: 'qualified',
    sector: 'Technology',
    priority: 'high',
    probability: 75,
    close_date: '2025-02-15',
    owner: 'Sales Team',
    description: 'Large enterprise software deployment',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    company: DUMMY_COMPANIES[0],
    contact: DUMMY_CONTACTS[0]
  },
  {
    id: '2',
    title: 'Solar Panel Installation',
    company_id: '2',
    contact_id: '3',
    amount: 75000,
    forecast_amount: 75000,
    status: 'proposal',
    sector: 'Energy',
    priority: 'medium',
    probability: 60,
    close_date: '2025-03-01',
    owner: 'Sales Team',
    description: 'Commercial solar panel installation project',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    company: DUMMY_COMPANIES[1],
    contact: DUMMY_CONTACTS[2]
  },
  {
    id: '3',
    title: 'Medical Equipment Supply',
    company_id: '3',
    contact_id: '4',
    amount: 200000,
    forecast_amount: 180000,
    status: 'negotiation',
    sector: 'Healthcare',
    priority: 'high',
    probability: 80,
    close_date: '2025-01-30',
    owner: 'Sales Team',
    description: 'Supply of advanced medical equipment',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
    company: DUMMY_COMPANIES[2],
    contact: DUMMY_CONTACTS[3]
  },
  {
    id: '4',
    title: 'Financial Software Implementation',
    company_id: '4',
    contact_id: '5',
    amount: 50000,
    forecast_amount: 50000,
    status: 'won',
    sector: 'Finance',
    priority: 'medium',
    probability: 100,
    close_date: '2024-12-20',
    owner: 'Sales Team',
    description: 'Complete financial management system implementation',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z',
    company: DUMMY_COMPANIES[3],
    contact: DUMMY_CONTACTS[4]
  }
];

// Dummy activities for dashboard
const DUMMY_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Follow up on proposal',
    description: 'Call to discuss proposal details',
    type: 'call',
    start_time: '2025-11-15T10:00:00Z',
    end_time: '2025-11-15T10:30:00Z',
    status: 'scheduled',
    contact_id: '1',
    company_id: '1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    contact: DUMMY_CONTACTS[0],
    company: DUMMY_COMPANIES[0]
  },
  {
    id: '2',
    title: 'Send contract for review',
    description: 'Email contract for final review',
    type: 'email',
    start_time: '2025-11-14T14:00:00Z',
    end_time: '2025-11-14T14:15:00Z',
    status: 'completed',
    contact_id: '4',
    company_id: '3',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    contact: DUMMY_CONTACTS[3],
    company: DUMMY_COMPANIES[2]
  }
];

export const useCRMStore = create<CRMStore>((set, get) => ({
  contacts: [],
  companies: [],
  opportunities: [],
  activities: [],
  expenses: [],
  settings: null,
  loading: false,
  subscriptions: {},

  // --------------------------
  // LEADS LOGIC (LOCAL STORAGE)
  // --------------------------

  leads: [],

  fetchLeads: async () => {
    // Load from localStorage
    const stored = localStorage.getItem('leads');
    if (stored) {
      set({ leads: JSON.parse(stored) });
    }
  },

  addLead: async (lead) => {
    const newLead = {
      ...lead,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const leads = [...get().leads, newLead];
    set({ leads });
    localStorage.setItem('leads', JSON.stringify(leads));
  },

  updateLead: async (id, updates) => {
    const leads = get().leads.map((l) =>
      l.id === id ? { ...l, ...updates, updated_at: new Date().toISOString() } : l
    );
    set({ leads });
    localStorage.setItem('leads', JSON.stringify(leads));
  },

  deleteLead: async (id) => {
    const leads = get().leads.filter((l) => l.id !== id);
    set({ leads });
    localStorage.setItem('leads', JSON.stringify(leads));
  },

  fetchContacts: async () => {
    try {
      console.log('Fetching contacts from database...');
      const { data, error } = await supabase.from('contacts').select('*, company:companies(*)').order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching contacts:', error);
        console.log('Using dummy contacts instead');
        set({ contacts: DUMMY_CONTACTS });
      } else if (data) {
        console.log('Fetched contacts from database:', data.length);
        set({ contacts: data });
      }
    } catch (error) {
      console.error('Exception fetching contacts:', error);
      console.log('Using dummy contacts instead');
      set({ contacts: DUMMY_CONTACTS });
    }
  },

  fetchCompanies: async () => {
    try {
      console.log('Fetching companies from database...');
      const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching companies:', error);
        console.log('Using dummy companies instead');
        set({ companies: DUMMY_COMPANIES });
      } else if (data && data.length > 0) {
        console.log('Fetched companies from database:', data.length);
        set({ companies: data });
      } else {
        console.log('No companies in database, using dummy companies');
        set({ companies: DUMMY_COMPANIES });
      }
    } catch (error) {
      console.error('Exception fetching companies:', error);
      console.log('Using dummy companies instead');
      set({ companies: DUMMY_COMPANIES });
    }
  },

  fetchOpportunities: async () => {
    try {
      console.log('Fetching opportunities from database...');
      const { data, error } = await supabase.from('opportunities').select('*, company:companies(*), contact:contacts(*)').order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching opportunities:', error);
        console.log('Using dummy opportunities instead');
        set({ opportunities: DUMMY_OPPORTUNITIES });
      } else if (data) {
        console.log('Fetched opportunities from database:', data.length);
        set({ opportunities: data });
      } else {
        console.log('No opportunities in database, using dummy opportunities');
        set({ opportunities: DUMMY_OPPORTUNITIES });
      }
    } catch (error) {
      console.error('Exception fetching opportunities:', error);
      console.log('Using dummy opportunities instead');
      set({ opportunities: DUMMY_OPPORTUNITIES });
    }
  },

  fetchActivities: async () => {
    try {
      console.log('Fetching activities from database...');
      const { data, error } = await supabase.from('activities').select('*, contact:contacts(*), company:companies(*), opportunity:opportunities(*)').order('start_time', { ascending: false });
      
      if (error) {
        console.error('Error fetching activities:', error);
        console.log('Using dummy activities instead');
        set({ activities: DUMMY_ACTIVITIES });
      } else if (data) {
        console.log('Fetched activities from database:', data.length);
        set({ activities: data });
      } else {
        console.log('No activities in database, using dummy activities');
        set({ activities: DUMMY_ACTIVITIES });
      }
    } catch (error) {
      console.error('Exception fetching activities:', error);
      console.log('Using dummy activities instead');
      set({ activities: DUMMY_ACTIVITIES });
    }
  },

  fetchExpenses: async () => {
    try {
      const { data } = await supabase.from('expenses').select('*, opportunity:opportunities(*)').order('date', { ascending: false });
      if (data) set({ expenses: data });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      set({ expenses: [] });
    }
  },

  fetchSettings: async () => {
    try {
      const { data } = await supabase.from('settings').select('*').maybeSingle();
      if (data) {
        set({ settings: data });
      } else {
        const { data: newSettings } = await supabase.from('settings').insert({}).select().single();
        if (newSettings) set({ settings: newSettings });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      set({ settings: null });
    }
  },

  // Real-time subscriptions setup
  subscribeToRealtime: () => {
    const subscriptions = get().subscriptions;
    
    // Unsubscribe from existing subscriptions
    get().unsubscribeFromRealtime();

    console.log('Setting up real-time subscriptions...');

    // Subscribe to contacts changes
    const contactsSubscription = supabase
      .channel('contacts-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contacts' },
        (payload) => {
          console.log('Contacts change detected:', payload);
          get().fetchContacts();
        }
      )
      .subscribe();

    // Subscribe to companies changes
    const companiesSubscription = supabase
      .channel('companies-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'companies' },
        (payload) => {
          console.log('Companies change detected:', payload);
          get().fetchCompanies();
        }
      )
      .subscribe();

    // Subscribe to opportunities changes
    const opportunitiesSubscription = supabase
      .channel('opportunities-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'opportunities' },
        (payload) => {
          console.log('Opportunities change detected:', payload);
          get().fetchOpportunities();
        }
      )
      .subscribe();

    // Subscribe to activities changes
    const activitiesSubscription = supabase
      .channel('activities-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'activities' },
        (payload) => {
          console.log('Activities change detected:', payload);
          get().fetchActivities();
        }
      )
      .subscribe();

    // Subscribe to expenses changes
    const expensesSubscription = supabase
      .channel('expenses-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'expenses' },
        (payload) => {
          console.log('Expenses change detected:', payload);
          get().fetchExpenses();
        }
      )
      .subscribe();

    // Subscribe to settings changes
    const settingsSubscription = supabase
      .channel('settings-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        (payload) => {
          console.log('Settings change detected:', payload);
          get().fetchSettings();
        }
      )
      .subscribe();

    // Store subscription references for cleanup
    set({ 
      subscriptions: {
        contacts: contactsSubscription,
        companies: companiesSubscription,
        opportunities: opportunitiesSubscription,
        activities: activitiesSubscription,
        expenses: expensesSubscription,
        settings: settingsSubscription
      }
    });

    console.log('Real-time subscriptions active');
  },

  unsubscribeFromRealtime: () => {
    const subscriptions = get().subscriptions;
    
    Object.values(subscriptions).forEach((subscription) => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        console.log('Unsubscribing from channel');
        supabase.removeChannel(subscription);
      }
    });

    set({ subscriptions: {} });
    console.log('All real-time subscriptions cleaned up');
  },

  addContact: async (contact) => {
    try {
      console.log('Adding contact:', contact);
      const { data, error } = await supabase.from('contacts').insert(contact).select('*, company:companies(*)').single();
      
      if (error) {
        console.error('Database error adding contact:', error);
        
        // If database fails, add to local state for immediate UI feedback
        const tempContact: Contact = {
          ...contact,
          id: 'temp-' + Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          company: contact.company_id ? get().companies.find(c => c.id === contact.company_id) : undefined
        };
        
        console.log('Adding contact locally:', tempContact);
        set({ contacts: [tempContact, ...get().contacts] });
        console.log('Contact added locally, total contacts:', get().contacts.length + 1);
        return;
      }
      
      if (data) {
        console.log('Contact added to database successfully:', data);
        set({ contacts: [data, ...get().contacts] });
        console.log('Total contacts after adding:', get().contacts.length + 1);
      }
    } catch (error) {
      console.error('Exception adding contact:', error);
      
      // Fallback to local addition
      const tempContact: Contact = {
        ...contact,
        id: 'temp-' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        company: contact.company_id ? get().companies.find(c => c.id === contact.company_id) : undefined
      };
      
      set({ contacts: [tempContact, ...get().contacts] });
      console.log('Contact added locally due to error');
    }
  },

  updateContact: async (id, contact) => {
    try {
      const { data } = await supabase.from('contacts').update({ ...contact, updated_at: new Date().toISOString() }).eq('id', id).select('*, company:companies(*)').single();
      if (data) set({ contacts: get().contacts.map(c => c.id === id ? data : c) });
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  },

  deleteContact: async (id) => {
    try {
      await supabase.from('contacts').delete().eq('id', id);
      set({ contacts: get().contacts.filter(c => c.id !== id) });
    } catch (error) {
      console.error('Error deleting contact:', error);
      // For temp contacts, just remove from local state
      set({ contacts: get().contacts.filter(c => c.id !== id) });
    }
  },

  addCompany: async (company) => {
    try {
      // Optimistically update the UI immediately
      const tempCompany: Company = {
        ...company,
        id: 'temp-' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to local state immediately
      set({ companies: [tempCompany, ...get().companies] });
      console.log('Company added optimistically:', tempCompany);
      
      // Now try to save to database
      const { data, error } = await supabase.from('companies').insert(company).select().single();
      
      if (error) {
        console.error('Database error adding company:', error);
        // Remove the optimistic update on error
        set({ companies: get().companies.filter(c => c.id !== tempCompany.id) });
        throw error;
      }
      
      if (data) {
        console.log('Company saved to database successfully:', data);
        // Replace the optimistic update with real data
        set({ companies: [data, ...get().companies.filter(c => c.id !== tempCompany.id)] });
      }
    } catch (error) {
      console.error('Error adding company:', error);
      throw error;
    }
  },

  updateCompany: async (id, company) => {
    try {
      const { data } = await supabase.from('companies').update({ ...company, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (data) set({ companies: get().companies.map(c => c.id === id ? data : c) });
    } catch (error) {
      console.error('Error updating company:', error);
    }
  },

  deleteCompany: async (id) => {
    try {
      await supabase.from('companies').delete().eq('id', id);
      set({ companies: get().companies.filter(c => c.id !== id) });
    } catch (error) {
      console.error('Error deleting company:', error);
      set({ companies: get().companies.filter(c => c.id !== id) });
    }
  },

  addOpportunity: async (opportunity) => {
    try {
      // Optimistically update the UI immediately
      const tempOpportunity: Opportunity = {
        ...opportunity,
        id: 'temp-' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        company: opportunity.company_id ? get().companies.find(c => c.id === opportunity.company_id) : undefined,
        contact: opportunity.contact_id ? get().contacts.find(c => c.id === opportunity.contact_id) : undefined
      };
      
      // Add to local state immediately
      set({ opportunities: [tempOpportunity, ...get().opportunities] });
      console.log('Opportunity added optimistically:', tempOpportunity);
      
      // Now try to save to database
      const { data, error } = await supabase.from('opportunities').insert(opportunity).select('*, company:companies(*), contact:contacts(*)').single();
      
      if (error) {
        console.error('Database error adding opportunity:', error);
        // Remove the optimistic update on error
        set({ opportunities: get().opportunities.filter(o => o.id !== tempOpportunity.id) });
        throw error;
      }
      
      if (data) {
        console.log('Opportunity saved to database successfully:', data);
        // Replace the optimistic update with real data
        set({ opportunities: [data, ...get().opportunities.filter(o => o.id !== tempOpportunity.id)] });
      }
    } catch (error) {
      console.error('Error adding opportunity:', error);
      throw error;
    }
  },

  updateOpportunity: async (id, opportunity) => {
    try {
      // Optimistically update the UI immediately
      const existingOpportunity = get().opportunities.find(o => o.id === id);
      if (existingOpportunity) {
        const optimisticOpportunity: Opportunity = {
          ...existingOpportunity,
          ...opportunity,
          updated_at: new Date().toISOString()
        };
        
        set({ opportunities: get().opportunities.map(o => o.id === id ? optimisticOpportunity : o) });
        console.log('Opportunity updated optimistically:', optimisticOpportunity);
      }
      
      // Now try to save to database
      const { data, error } = await supabase.from('opportunities').update({ ...opportunity, updated_at: new Date().toISOString() }).eq('id', id).select('*, company:companies(*), contact:contacts(*)').single();
      
      if (error) {
        console.error('Database error updating opportunity:', error);
        // Revert optimistic update on error - refetch from database
        get().fetchOpportunities();
        throw error;
      }
      
      if (data) {
        console.log('Opportunity saved to database successfully:', data);
        // Update with real data from database
        set({ opportunities: get().opportunities.map(o => o.id === id ? data : o) });
      }
    } catch (error) {
      console.error('Error updating opportunity:', error);
      throw error;
    }
  },

  deleteOpportunity: async (id) => {
    try {
      await supabase.from('opportunities').delete().eq('id', id);
      set({ opportunities: get().opportunities.filter(o => o.id !== id) });
    } catch (error) {
      console.error('Error deleting opportunity:', error);
    }
  },

  addActivity: async (activity) => {
    try {
      // Optimistically update the UI immediately
      const tempActivity: Activity = {
        ...activity,
        id: 'temp-' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        contact: activity.contact_id ? get().contacts.find(c => c.id === activity.contact_id) : undefined,
        company: activity.company_id ? get().companies.find(c => c.id === activity.company_id) : undefined,
        opportunity: activity.opportunity_id ? get().opportunities.find(o => o.id === activity.opportunity_id) : undefined
      };
      
      // Add to local state immediately
      set({ activities: [tempActivity, ...get().activities] });
      console.log('Activity added optimistically:', tempActivity);
      
      // Now try to save to database
      const { data, error } = await supabase.from('activities').insert(activity).select('*, contact:contacts(*), company:companies(*), opportunity:opportunities(*)').single();
      
      if (error) {
        console.error('Database error adding activity:', error);
        // Remove the optimistic update on error
        set({ activities: get().activities.filter(a => a.id !== tempActivity.id) });
        throw error;
      }
      
      if (data) {
        console.log('Activity saved to database:', data);
        // Replace the optimistic update with real data
        set({ activities: [data, ...get().activities.filter(a => a.id !== tempActivity.id)] });
      }
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  },

  updateActivity: async (id, activity) => {
    try {
      const { data } = await supabase.from('activities').update({ ...activity, updated_at: new Date().toISOString() }).eq('id', id).select('*, contact:contacts(*), company:companies(*), opportunity:opportunities(*)').single();
      if (data) set({ activities: get().activities.map(a => a.id === id ? data : a) });
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  },

  deleteActivity: async (id) => {
    try {
      await supabase.from('activities').delete().eq('id', id);
      set({ activities: get().activities.filter(a => a.id !== id) });
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  },

  addExpense: async (expense) => {
    try {
      const { data } = await supabase.from('expenses').insert(expense).select('*, opportunity:opportunities(*)').single();
      if (data) set({ expenses: [data, ...get().expenses] });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  },

  updateExpense: async (id, expense) => {
    try {
      const { data } = await supabase.from('expenses').update({ ...expense, updated_at: new Date().toISOString() }).eq('id', id).select('*, opportunity:opportunities(*)').single();
      if (data) set({ expenses: get().expenses.map(e => e.id === id ? data : e) });
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  },

  deleteExpense: async (id) => {
    try {
      await supabase.from('expenses').delete().eq('id', id);
      set({ expenses: get().expenses.filter(e => e.id !== id) });
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  },

  updateSettings: async (settings) => {
    const currentSettings = get().settings;
    if (!currentSettings) return;

    try {
      // Optimistically update the UI immediately
      const tempSettings = {
        ...currentSettings,
        ...settings,
        updated_at: new Date().toISOString()
      };
      
      // Update local state immediately for real-time feel
      set({ settings: tempSettings });
      console.log('Settings updated optimistically:', tempSettings);
      
      // Now try to save to database
      const { data, error } = await supabase.from('settings').update({ ...settings, updated_at: new Date().toISOString() }).eq('id', currentSettings.id).select().single();
      
      if (error) {
        console.error('Database error updating settings:', error);
        // Revert optimistic update on error
        set({ settings: currentSettings });
        throw error;
      }
      
      if (data) {
        console.log('Settings saved to database successfully:', data);
        // Update with real data from database
        set({ settings: data });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  importData: async (data) => {
    set({ loading: true });

    try {
      if (data.companies) {
        await supabase.from('companies').insert(data.companies);
      }

      if (data.contacts) {
        await supabase.from('contacts').insert(data.contacts);
      }

      if (data.opportunities) {
        await supabase.from('opportunities').insert(data.opportunities);
      }

      await get().fetchCompanies();
      await get().fetchContacts();
      await get().fetchOpportunities();

      // Handle leads (localStorage)
      if (data.leads) {
        const existingLeads = get().leads;
        const newLeads = data.leads.map(lead => ({
          ...lead,
          id: lead.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
          created_at: lead.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        const updatedLeads = [...existingLeads, ...newLeads];
        set({ leads: updatedLeads });
        localStorage.setItem('leads', JSON.stringify(updatedLeads));
      }
    } catch (error) {
      console.error('Error importing data:', error);
    } finally {
      set({ loading: false });
    }
  },
}));
