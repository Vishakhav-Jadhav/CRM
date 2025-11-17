'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useState, useEffect } from 'react';
import { useCRMStore } from '@/lib/store';

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    fetchContacts,
    fetchCompanies,
    fetchOpportunities,
    fetchActivities,
    fetchSettings,
    subscribeToRealtime,
    unsubscribeFromRealtime
  } = useCRMStore();

  // Initialize data and real-time subscriptions on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('Initializing CRM data...');
        
        // Fetch all data
        await Promise.all([
          fetchContacts(),
          fetchCompanies(),
          fetchOpportunities(),
          fetchActivities(),
          fetchSettings()
        ]);

        // Set up real-time subscriptions
        subscribeToRealtime();
        
        console.log('CRM data and real-time subscriptions initialized');
      } catch (error) {
        console.error('Error initializing CRM data:', error);
      }
    };

    initializeData();

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeFromRealtime();
    };
  }, [fetchContacts, fetchCompanies, fetchOpportunities, fetchActivities, fetchSettings, subscribeToRealtime, unsubscribeFromRealtime]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuChange={setMobileMenuOpen}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-auto bg-background p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}