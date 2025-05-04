
import React from 'react';
import { Calendar, Download, Filter, Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ScheduleFilterBar: React.FC = () => {
  const { theme } = useTheme();
  const bgClass = theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-100';
  const textClass = theme === 'dark' ? 'text-zinc-200' : 'text-gray-700';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-wrap gap-2">
        <button className={`px-4 py-2 ${bgClass} rounded ${textClass} flex items-center gap-2 text-sm`}>
          <Filter size={16} />
          <span>All Services</span>
        </button>
        
        <button className={`px-4 py-2 ${bgClass} rounded ${textClass} flex items-center gap-2 text-sm`}>
          <Calendar size={16} />
          <span>June 2025</span>
        </button>
        
        <button className={`px-4 py-2 ${bgClass} rounded ${textClass} flex items-center gap-2 text-sm`}>
          <Users size={16} />
          <span>All Teams</span>
        </button>
      </div>
      
      <div className="flex justify-end gap-2">
        <div className="flex bg-zinc-800/70 rounded overflow-hidden">
          <button className="px-4 py-2 text-sm text-green-400 bg-green-900/20">Daily</button>
          <button className="px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-700/50">Weekly</button>
          <button className="px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-700/50">Monthly</button>
        </div>
        
        <button className={`px-4 py-2 ${bgClass} rounded ${textClass} flex items-center gap-2 text-sm`}>
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default ScheduleFilterBar;
