
import React from 'react';
import { CalendarDays, CheckCheck, LayoutDashboard, ListChecks, Users2 } from 'lucide-react';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import DashboardShell from '../../../components/layout/DashboardShell';
import { useGetMeasurementsQuery } from '@/services/apiSlice';
import DashboardGridRow from '../../../components/layout/DashboardGridRow';
import DashboardMeasurementSection from '../../../components/dashboard/DashboardMeasurementSection';
import ActivityFeedCard from '../../../components/dashboard/activity-feed';
import DashboardProjectsSection from '../../../components/dashboard/DashboardProjectsSection';

interface DashboardPageProps {
  className?: string;
}
interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}
const navItems: NavItem[] = [{
  title: 'Overview',
  href: '/dashboard',
  icon: LayoutDashboard
}, {
  title: 'Analytics',
  href: '/dashboard/analytics',
  icon: ListChecks
}, {
  title: 'Projects',
  href: '/dashboard/projects',
  icon: CalendarDays
}, {
  title: 'Team',
  href: '/dashboard/team',
  icon: Users2,
  disabled: true
}, {
  title: 'Settings',
  href: '/dashboard/settings',
  icon: CheckCheck,
  disabled: true
}];

// Temporary components to replace missing imports
const Icons = {
  revenue: ({
    className
  }: {
    className?: string;
  }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 7c0-1.1-.9-2-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /><path d="M22 13V8h-5" /><path d="m18 13 4-5" /></svg>,
  average_order_value: ({
    className
  }: {
    className?: string;
  }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>,
  customers: ({
    className
  }: {
    className?: string;
  }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  page_views: ({
    className
  }: {
    className?: string;
  }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
};

// Simple Overview component
const Overview = () => <div className="w-full h-72 bg-zinc-800/50 rounded-md flex items-center justify-center">
    <p className="text-zinc-500">Overview Chart</p>
  </div>;

// Simple RecentSales component
const RecentSales = () => <div className="space-y-4">
    {[1, 2, 3].map(i => <div key={i} className="flex justify-between items-center">
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
      </div>)}
  </div>;

const DashboardPage: React.FC<DashboardPageProps> = ({
  className
}) => {
  // Use our RTK Query hook for measurements
  const { 
    data: measurementsResponse, 
    error: measurementsError, 
    isLoading: isMeasurementsLoading,
    refetch: refetchMeasurements
  } = useGetMeasurementsQuery();
  
  // Log information about the query status
  React.useEffect(() => {
    console.log('Dashboard RTK Query status:', { 
      isLoading: isMeasurementsLoading,
      hasData: !!measurementsResponse?.data,
      errorMessage: measurementsError || measurementsResponse?.error,
    });
    
    // If there's an error, schedule a single retry after 5 seconds
    if (measurementsError || measurementsResponse?.error) {
      const timer = setTimeout(() => {
        console.log('Attempting to refetch measurements after error');
        refetchMeasurements();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [measurementsResponse, measurementsError, isMeasurementsLoading, refetchMeasurements]);
  
  return <DashboardShell>
      <div className="grid gap-4">
        {/* Pass the measurement data to the MeasurementSection */}
        <DashboardMeasurementSection 
          measurements={measurementsResponse?.data || []}
          isLoading={isMeasurementsLoading}
          error={measurementsError || measurementsResponse?.error || null}
          onRefresh={refetchMeasurements}
        />
        
        {/* Team Activity and Active Projects Section using the reusable DashboardGridRow */}
        <DashboardGridRow>
          {/* Team Activity */}
          <div className="flex-1 w-full">
            <ActivityFeedCard />
          </div>
          
          {/* Active Projects */}
          <div className="flex-1 w-full">
            <DashboardProjectsSection />
          </div>
        </DashboardGridRow>
      </div>
    </DashboardShell>;
};

export default DashboardPage;
