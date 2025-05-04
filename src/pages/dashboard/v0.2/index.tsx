
import React from 'react';
import { CalendarDays, CheckCheck, LayoutDashboard, ListChecks, Users2 } from 'lucide-react';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import DashboardShell from '../../../components/layout/DashboardShell';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import RecentMeasurements from '../../../components/dashboard/RecentMeasurements';
import MeasurementOverview from '../../../components/dashboard/MeasurementOverview';
import DashboardProjectsSection from '../../../components/dashboard/DashboardProjectsSection';
import ActivityFeed from '../../../components/dashboard/ActivityFeed';

interface DashboardPageProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: ListChecks,
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: CalendarDays,
  },
  {
    title: 'Team',
    href: '/dashboard/team',
    icon: Users2,
    disabled: true,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: CheckCheck,
    disabled: true,
  },
];

// Temporary components to replace missing imports
const Icons = {
  revenue: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 7c0-1.1-.9-2-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/><path d="M22 13V8h-5"/><path d="m18 13 4-5"/></svg>
  ),
  average_order_value: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
  ),
  customers: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  page_views: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  )
};

// Simple Overview component
const Overview = () => (
  <div className="w-full h-72 bg-zinc-800/50 rounded-md flex items-center justify-center">
    <p className="text-zinc-500">Overview Chart</p>
  </div>
);

// Simple RecentSales component
const RecentSales = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-700"></div>
          <div>
            <p className="text-sm font-medium">Customer {i}</p>
            <p className="text-xs text-zinc-500">customer{i}@example.com</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">+$150.00</p>
          <p className="text-xs text-zinc-500">Today</p>
        </div>
      </div>
    ))}
  </div>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ className }) => {
  return (
    <DashboardShell>
      <div className="grid gap-4">
        <Card className="col-span-4">
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
            <div className="border dark:border-zinc-800/50 rounded-lg p-4 flex space-x-4 items-center">
              <div>
                <Icons.revenue className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-lg font-semibold">$45,231.89</p>
              </div>
            </div>
            <div className="border dark:border-zinc-800/50 rounded-lg p-4 flex space-x-4 items-center">
              <div>
                <Icons.average_order_value className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Order Value</p>
                <p className="text-lg font-semibold">$231.89</p>
              </div>
            </div>
            <div className="border dark:border-zinc-800/50 rounded-lg p-4 flex space-x-4 items-center">
              <div>
                <Icons.customers className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-lg font-semibold">+2350</p>
              </div>
            </div>
            <div className="border dark:border-zinc-800/50 rounded-lg p-4 flex space-x-4 items-center">
              <div>
                <Icons.page_views className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Page Views</p>
                <p className="text-lg font-semibold">+12,234</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Overview</h2>
                <Badge variant="secondary">
                  Last 30 days
                </Badge>
              </div>
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recent Sales</h2>
                <Button size="sm" variant="outline">
                  View all
                </Button>
              </div>
              <RecentSales />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-12 lg:col-span-4">
            <MeasurementOverview />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <ActivityFeed />
          </div>
        </div>

        <DashboardProjectsSection />
      </div>
    </DashboardShell>
  );
};

export default DashboardPage;
