'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Building2, Target, Calendar, DollarSign, Upload, Settings, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu } from 'lucide-react';
import { useCRMStore } from '@/lib/store';

import type { Opportunity, Activity } from '@/types';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  getCount?: (store: any) => number;
  getStatus?: (store: any) => 'active' | 'warning' | 'success' | 'default';
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    getCount: () => 0,
    getStatus: () => 'default' as const
  },
  {
    name: 'Contacts',
    href: '/contacts',
    icon: Users,
    getCount: (store: any) => store.contacts.length,
    getStatus: () => 'default' as const
  },
  {
    name: 'Companies',
    href: '/companies',
    icon: Building2,
    getCount: (store: any) => store.companies.length,
    getStatus: () => 'default' as const
  },
  {
    name: 'Opportunities',
    href: '/opportunities',
    icon: Target,
    getCount: (store: any) => store.opportunities.filter((o: any) => o.status !== 'won' && o.status !== 'lost').length,
    getStatus: (store: any) => {
      const highPriority = store.opportunities.filter((o: any) => o.priority === 'high' && o.status !== 'won' && o.status !== 'lost').length;
      return highPriority > 0 ? 'warning' as const : 'default' as const;
    }
  },
  {
    name: 'Schedule',
    href: '/calendar',
    icon: Calendar,
    getCount: (store: any) => {
      const today = new Date().toISOString().split('T')[0];
      return store.activities.filter((a: any) => a.start_time?.startsWith(today) && a.status === 'scheduled').length;
    },
    getStatus: (store: any) => {
      const today = new Date().toISOString().split('T')[0];
      const todayActivities = store.activities.filter((a: any) => a.start_time?.startsWith(today) && a.status === 'scheduled').length;
      return todayActivities > 0 ? 'active' as const : 'default' as const;
    }
  },
  {
    name: 'Expenses',
    href: '/expenses',
    icon: DollarSign,
    getCount: (store: any) => store.expenses.length,
    getStatus: () => 'default' as const
  },
  {
    name: 'Leads',
    href: '/leads',
    icon: Target,
    getCount: (store: any) => store.contacts.length,
    getStatus: () => 'default' as const
  },
  {
    name: 'Import Data',
    href: '/import',
    icon: Upload,
    getCount: () => 0,
    getStatus: () => 'default' as const
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    getCount: () => 0,
    getStatus: () => 'default' as const
  },
];

interface SidebarProps {
  mobileMenuOpen?: boolean;
  onMobileMenuChange?: (open: boolean) => void;
}

export function Sidebar({ mobileMenuOpen, onMobileMenuChange }: SidebarProps) {
  const pathname = usePathname();
  const store = useCRMStore();

  const getStatusColor = (status: 'active' | 'warning' | 'success' | 'default') => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'warning': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'success': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: 'active' | 'warning' | 'success' | 'default') => {
    switch (status) {
      case 'active': return <Clock className="h-3 w-3" />;
      case 'warning': return <TrendingUp className="h-3 w-3" />;
      case 'success': return <Target className="h-3 w-3" />;
      default: return null;
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">CRM Pro</h1>
        
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const count = item.getCount ? item.getCount(store) : 0;
          const status = item.getStatus ? item.getStatus(store) : 'default';
          const statusColor = getStatusColor(status);
          const statusIcon = getStatusIcon(status);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              onClick={() => onMobileMenuChange?.(false)}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
                {statusIcon && (
                  <span className={cn('flex items-center', statusColor)}>
                    {statusIcon}
                  </span>
                )}
              </div>
              
              {count > 0 && (
                <Badge
                  variant={status === 'warning' ? 'destructive' : 'secondary'}
                  className="ml-auto h-5 px-1.5 text-xs"
                >
                  {count > 99 ? '99+' : count}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Quick Stats Footer */}
      <div className="border-t p-4 space-y-2">
        <div className="text-xs text-muted-foreground font-medium">Today's Summary</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span className="text-muted-foreground">
              {store.activities.filter((a: any) => {
                const today = new Date().toISOString().split('T')[0];
                return a.start_time?.startsWith(today);
              }).length} activities
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">
              ₹{store.opportunities.filter((o: any) => o.status === 'won').reduce((sum: number, o: any) => sum + o.amount, 0).toLocaleString()} won
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop sidebar
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>
      
      {/* Mobile Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={onMobileMenuChange}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
