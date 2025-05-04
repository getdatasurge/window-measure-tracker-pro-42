
import React from 'react';
import ScheduleFilterBar from '../components/schedule/ScheduleFilterBar';
import ScheduleOverview from '../components/schedule/ScheduleOverview';
import ScheduleCharts from '../components/schedule/ScheduleCharts';
import ScheduleCalendar from '../components/schedule/ScheduleCalendar';
import { useTheme } from '../contexts/ThemeContext';

const SchedulePage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`p-6 min-h-screen ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <ScheduleFilterBar />
        <ScheduleOverview />
        <ScheduleCharts />
        <ScheduleCalendar />
      </div>
    </div>
  );
};

export default SchedulePage;
