
import React from 'react';
import { Calendar, Download, Filter } from 'lucide-react';

const ScheduleFilterBar: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-semibold text-white">Service Schedule</h1>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 bg-zinc-800 rounded text-zinc-200 flex items-center gap-2 text-sm">
          <Calendar size={16} />
          <span>June 2025</span>
        </button>
        
        <button className="px-4 py-2 bg-zinc-800 rounded text-zinc-200 flex items-center gap-2 text-sm">
          <Filter size={16} />
          <span>Filter</span>
        </button>
        
        <button className="px-4 py-2 bg-zinc-800 rounded text-zinc-200 flex items-center gap-2 text-sm">
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default ScheduleFilterBar;
