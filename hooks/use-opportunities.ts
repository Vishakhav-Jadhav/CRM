'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Opportunity } from '@/types';

// Development mode - mock data if Supabase URL is placeholder
const isDevelopment = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project') ||
                     process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('example') ||
                     !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                     !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('your-');

// Mock opportunities data
const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Website Redesign Project',
    company_id: '1',
    contact_id: '1',
    amount: 50000,
    forecast_amount: 45000,
    status: 'qualified',
    sector: 'Technology',
    priority: 'high',
    probability: 75,
    close_date: '2024-12-31',
    owner: 'John Doe',
    description: 'Complete website redesign for tech startup',
    competitors: [
      { name: 'Competitor A', strength: 'Strong', weakness: 'Expensive', positionVsYou: 'Ahead', status: 'Winning' },
      { name: 'Competitor B', strength: 'Fast', weakness: 'Limited features', positionVsYou: 'Behind', status: 'Losing' }
    ],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    company: { id: '1', name: 'TechCorp Inc' },
    contact: { id: '1', first_name: 'Jane', last_name: 'Smith' }
  },
  {
    id: '2',
    title: 'Mobile App Development',
    company_id: '2',
    contact_id: '2',
    amount: 75000,
    forecast_amount: 60000,
    status: 'proposal',
    sector: 'Technology',
    priority: 'medium',
    probability: 60,
    close_date: '2024-11-30',
    owner: 'John Doe',
    description: 'Native mobile app for e-commerce platform',
    competitors: [],
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
    company: { id: '2', name: 'ShopFlow Ltd' },
    contact: { id: '2', first_name: 'Mike', last_name: 'Johnson' }
  },
  {
    id: '3',
    title: 'Consulting Services',
    company_id: '3',
    contact_id: '3',
    amount: 25000,
    forecast_amount: 20000,
    status: 'won',
    sector: 'Finance',
    priority: 'low',
    probability: 100,
    close_date: '2024-10-15',
    owner: 'John Doe',
    description: 'Financial consulting for startup',
    competitors: [
      { name: 'Big Consulting Co', strength: 'Established', weakness: 'High cost', positionVsYou: 'Equal', status: 'Equal' }
    ],
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z',
    company: { id: '3', name: 'FinanceStart Inc' },
    contact: { id: '3', first_name: 'Sarah', last_name: 'Wilson' }
  }
];

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchOpportunities() {
      try {
        setLoading(true);

        if (isDevelopment) {
          // Use mock data in development
          if (isMounted) {
            setOpportunities(mockOpportunities);
            setError(null);
            setLoading(false);
          }
          return;
        }

        const { data, error } = await supabase
          .from('opportunities')
          .select(`
            *,
            company:companies(id, name),
            contact:contacts(id, first_name, last_name)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (isMounted) {
          setOpportunities(data || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted && !isDevelopment) {
          setLoading(false);
        }
      }
    }

    fetchOpportunities();

    // Set up real-time subscription (skip in development mode)
    let subscription: any = null;
    if (!isDevelopment) {
      subscription = supabase
        .channel('opportunities_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'opportunities'
          },
          (payload) => {
            console.log('Real-time change received:', payload);

            if (payload.eventType === 'INSERT') {
              const newOpportunity = payload.new as Opportunity;
              setOpportunities(prev => [
                {
                  ...newOpportunity,
                  company: payload.new.company,
                  contact: payload.new.contact
                },
                ...prev
              ]);
            } else if (payload.eventType === 'UPDATE') {
              const updatedOpportunity = payload.new as Opportunity;
              setOpportunities(prev =>
                prev.map(opp =>
                  opp.id === updatedOpportunity.id
                    ? {
                        ...updatedOpportunity,
                        company: payload.new.company,
                        contact: payload.new.contact
                      }
                    : opp
                )
              );
            } else if (payload.eventType === 'DELETE') {
              const deletedId = payload.old.id;
              setOpportunities(prev => prev.filter(opp => opp.id !== deletedId));
            }
          }
        )
        .subscribe();
    }

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const addOpportunity = async (opportunityData: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .insert([{
          ...opportunityData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select(`
          *,
          company:companies(id, name),
          contact:contacts(id, first_name, last_name)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add opportunity');
      throw err;
    }
  };

  const updateOpportunity = async (id: string, opportunityData: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .update({
          ...opportunityData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          company:companies(id, name),
          contact:contacts(id, first_name, last_name)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update opportunity');
      throw err;
    }
  };

  const deleteOpportunity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete opportunity');
      throw err;
    }
  };

  return {
    opportunities,
    loading,
    error,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity
  };
}