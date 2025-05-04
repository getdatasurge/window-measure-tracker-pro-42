
import React from 'react';
import ScheduleFilterBar from '../components/schedule/ScheduleFilterBar';
import ScheduleOverview from '../components/schedule/ScheduleOverview';
import ScheduleCharts from '../components/schedule/ScheduleCharts';
import ScheduleCalendar from '../components/schedule/ScheduleCalendar';
import DashboardShell from '../components/layout/DashboardShell';

const SchedulePage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <DashboardShell>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <ScheduleFilterBar />
          <ScheduleOverview />
          <ScheduleCharts />
          <ScheduleCalendar />
        </div>
      </div>
    </DashboardShell>
  );
};

export default SchedulePage;
