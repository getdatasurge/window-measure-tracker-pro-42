
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import ScheduleFilterBar from '../components/schedule/ScheduleFilterBar';
import ScheduleOverview from '../components/schedule/ScheduleOverview';
import ScheduleCharts from '../components/schedule/ScheduleCharts';
import ScheduleCalendar from '../components/schedule/ScheduleCalendar';
import DashboardShell from '../components/layout/DashboardShell';
import DashboardHeader from '../components/dashboard/DashboardHeader';

const SchedulePage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <DashboardHeader title="Schedule" />
        <ScheduleFilterBar />
        <ScheduleOverview />
        <ScheduleCharts />
        <ScheduleCalendar />
      </div>
    </DashboardShell>
  );
};

export default SchedulePage;
