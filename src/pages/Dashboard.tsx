
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import DashboardKpiSection from '../components/dashboard/DashboardKpiSection';
import DashboardChartsSection from '../components/dashboard/DashboardChartsSection';
import DashboardProjectsSection from '../components/dashboard/DashboardProjectsSection';
import DashboardActionsSection from '../components/dashboard/DashboardActionsSection';

const Dashboard = () => {
  const { toast } = useToast();
  
  const sampleProjects = [
    {
      id: 1,
      name: 'Lakeside Residence',
      color: 'blue' as const,
      client: 'John & Mary Smith',
      location: 'Bellevue, WA',
      windows: 24,
      progress: 75,
      deadline: 'Jun 30, 2025',
      status: 'In Progress'
    },
    {
      id: 2,
      name: 'Downtown Office Complex',
      color: 'purple' as const,
      client: 'Axis Commercial Properties',
      location: 'Seattle, WA',
      windows: 186,
      progress: 25,
      deadline: 'Aug 15, 2025',
      status: 'Just Started'
    },
    {
      id: 3,
      name: 'Harbor View Apartments',
      color: 'orange' as const,
      client: 'Emerald Bay Management',
      location: 'Tacoma, WA',
      windows: 94,
      progress: 60,
      deadline: 'Jul 10, 2025',
      status: 'Needs Review'
    },
    {
      id: 4,
      name: 'Sunnyvale Residence',
      color: 'red' as const,
      client: 'Robert & Lisa Anderson',
      location: 'Kirkland, WA',
      windows: 18,
      progress: 90,
      deadline: 'Jun 25, 2025',
      status: 'Final Check'
    },
    {
      id: 5,
      name: 'Westlake Tower',
      color: 'green' as const,
      client: 'Summit Properties LLC',
      location: 'Seattle, WA',
      windows: 132,
      progress: 40,
      deadline: 'Jul 30, 2025',
      status: 'In Progress'
    }
  ];
  
  const handleActionClick = (action: string) => {
    toast({
      title: action,
      description: `This feature will be available in Phase ${action === 'New Measurement' ? '3' : action === 'Schedule Installation' ? '4' : '5'}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <DashboardKpiSection />
      <DashboardChartsSection />
      <DashboardProjectsSection projects={sampleProjects} />
      <DashboardActionsSection onActionClick={handleActionClick} />
    </div>
  );
};

export default Dashboard;
