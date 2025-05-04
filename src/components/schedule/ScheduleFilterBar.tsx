
import React from 'react';
import { Calendar, Download, Filter } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ScheduleFilterBar: React.FC = () => {
  const { theme } = useTheme();
  const bgClass = theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-100';
  const textClass = theme === 'dark' ? 'text-zinc-200' : 'text-gray-700';

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className={`text-xl font-semibold ${textClass}`}>Service Schedule</h1>
      <div className="flex items-center gap-3">
        <button className={`px-4 py-2 ${bgClass} rounded ${textClass} flex items-center gap-2 text-sm`}>
          <Calendar size={16} />
          <span>June 2025</span>
        </button>
        
        <button className={`px-4 py-2 ${bgClass} rounded ${textClass} flex items-center gap-2 text-sm`}>
          <Filter size={16} />
          <span>Filter</span>
        </button>
        
        <button className={`px-4 py-2 ${bgClass} rounded ${textClass} flex items-center gap-2 text-sm`}>
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default ScheduleFilterBar;
