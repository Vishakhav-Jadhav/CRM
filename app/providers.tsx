'use client';

import { useEffect } from 'react';
import { useCRMStore } from '@/lib/store';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const fetchContacts = useCRMStore((state) => state.fetchContacts);
  const fetchCompanies = useCRMStore((state) => state.fetchCompanies);
  const fetchOpportunities = useCRMStore((state) => state.fetchOpportunities);
  const fetchActivities = useCRMStore((state) => state.fetchActivities);
  const fetchExpenses = useCRMStore((state) => state.fetchExpenses);
  const fetchSettings = useCRMStore((state) => state.fetchSettings);
  const fetchLeads = useCRMStore((state) => state.fetchLeads);
  const subscribeToRealtime = useCRMStore((state) => state.subscribeToRealtime);

  useEffect(() => {
    fetchSettings();
    fetchContacts();
    fetchCompanies();
    fetchOpportunities();
    fetchExpenses();
    fetchLeads();
    subscribeToRealtime();
  }, [fetchContacts, fetchCompanies, fetchOpportunities, fetchExpenses, fetchSettings, fetchLeads, subscribeToRealtime]);

  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}
