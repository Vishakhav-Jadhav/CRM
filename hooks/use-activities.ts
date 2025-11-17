'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Activity } from '@/types';

// Development mode - mock data if Supabase URL is placeholder
const isDevelopment = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project') ||
                     process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('example') ||
                     !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                     !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('your-');

// Mock activities data
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'Call',
    title: 'Initial consultation call',
    description: 'Discuss project requirements and timeline',
    start_time: '2024-01-20T10:00:00Z',
    end_time: '2024-01-20T11:00:00Z',
    status: 'completed',
    contact_id: '1',
    company_id: '1',
    opportunity_id: '1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T11:00:00Z',
    contact: { id: '1', first_name: 'Jane', last_name: 'Smith' },
    company: { id: '1', name: 'TechCorp Inc' },
    opportunity: { id: '1', title: 'Website Redesign Project', amount: 50000, forecast_amount: 45000, status: 'qualified', priority: 'high', probability: 75 } as any
  },
  {
    id: '2',
    type: 'Meeting',
    title: 'Project kickoff meeting',
    description: 'Review project scope and deliverables',
    start_time: '2024-01-25T14:00:00Z',
    end_time: '2024-01-25T15:30:00Z',
    status: 'scheduled',
    contact_id: '2',
    company_id: '2',
    opportunity_id: '2',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    contact: { id: '2', first_name: 'Mike', last_name: 'Johnson' },
    company: { id: '2', name: 'ShopFlow Ltd' },
    opportunity: { id: '2', title: 'Mobile App Development', amount: 75000, forecast_amount: 60000, status: 'proposal', priority: 'medium', probability: 60 } as any
  },
  {
    id: '3',
    type: 'Email',
    title: 'Follow up on proposal',
    description: 'Send updated proposal with revised pricing',
    start_time: '2024-01-22T09:00:00Z',
    status: 'completed',
    contact_id: '3',
    company_id: '3',
    opportunity_id: '3',
    created_at: '2024-01-21T10:00:00Z',
    updated_at: '2024-01-22T09:00:00Z',
    contact: { id: '3', first_name: 'Sarah', last_name: 'Wilson' },
    company: { id: '3', name: 'FinanceStart Inc' },
    opportunity: { id: '3', title: 'Consulting Services', amount: 25000, forecast_amount: 20000, status: 'won', priority: 'low', probability: 100 } as any
  }
];

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchActivities() {
      try {
        setLoading(true);

        if (isDevelopment) {
          // Use mock data in development
          if (isMounted) {
            setActivities(mockActivities);
            setError(null);
            setLoading(false);
          }
          return;
        }

        const { data, error } = await supabase
          .from('activities')
          .select(`
            *,
            contact:contacts(id, first_name, last_name),
            company:companies(id, name),
            opportunity:opportunities(id, title)
          `)
          .order('start_time', { ascending: true });

        if (error) throw error;

        if (isMounted) {
          setActivities(data || []);
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

    fetchActivities();

    // Set up real-time subscription (skip in development mode)
    let subscription: any = null;
    if (!isDevelopment) {
      subscription = supabase
        .channel('activities_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'activities'
          },
          (payload) => {
            console.log('Real-time activity change received:', payload);

            if (payload.eventType === 'INSERT') {
              const newActivity = payload.new as Activity;
              setActivities(prev => [
                {
                  ...newActivity,
                  contact: payload.new.contact,
                  company: payload.new.company,
                  opportunity: payload.new.opportunity
                },
                ...prev
              ]);
            } else if (payload.eventType === 'UPDATE') {
              const updatedActivity = payload.new as Activity;
              setActivities(prev =>
                prev.map(activity =>
                  activity.id === updatedActivity.id
                    ? {
                        ...updatedActivity,
                        contact: payload.new.contact,
                        company: payload.new.company,
                        opportunity: payload.new.opportunity
                      }
                    : activity
                )
              );
            } else if (payload.eventType === 'DELETE') {
              const deletedId = payload.old.id;
              setActivities(prev => prev.filter(activity => activity.id !== deletedId));
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

  const addActivity = async (activityData: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([{
          ...activityData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select(`
          *,
          contact:contacts(id, first_name, last_name),
          company:companies(id, name),
          opportunity:opportunities(id, title)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add activity');
      throw err;
    }
  };

  const updateActivity = async (id: string, activityData: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .update({
          ...activityData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          contact:contacts(id, first_name, last_name),
          company:companies(id, name),
          opportunity:opportunities(id, title)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update activity');
      throw err;
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete activity');
      throw err;
    }
  };

  return {
    activities,
    loading,
    error,
    addActivity,
    updateActivity,
    deleteActivity
  };
}