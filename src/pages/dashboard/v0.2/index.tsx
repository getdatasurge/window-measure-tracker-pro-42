import React from 'react';
import { CalendarDays, CheckCheck, LayoutDashboard, ListChecks, LucideIcon, Users2 } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/DashboardHeader';
import { DashboardShell } from '../../../components/dashboard/DashboardShell';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Icons } from '../../../components/ui/icons';
import { Button } from '../../../components/ui/button';
import { MainNav } from '../../../components/dashboard/MainNav';
import { Overview } from '../../../components/dashboard/Overview';
import { RecentSales } from '../../../components/dashboard/RecentSales';
import { Search } from '../../../components/dashboard/Search';
import { UserAvatar } from '../../../components/dashboard/UserAvatar';
import { TeamActivityFeed } from '../../../components/dashboard/TeamActivityFeed';
import RecentMeasurements from '../../../components/dashboard/RecentMeasurements';
import MeasurementOverview from '../../../components/dashboard/MeasurementOverview';
import DashboardProjectsSection from '../../../components/dashboard/DashboardProjectsSection';
import { ActivityFeed } from '../../../components/dashboard/ActivityFeed';

interface DashboardPageProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
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

const DashboardPage: React.FC<DashboardPageProps> = ({ className }) => {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Track your progress and manage your projects." />
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
