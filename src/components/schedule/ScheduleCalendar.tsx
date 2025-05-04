
import React from 'react';
import ServiceBlock from './ServiceBlock';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type DayData = {
  date: string;
  day: string;
  month: string;
  services: number;
  blocks: Array<{
    time: string;
    type: 'Window Measurement' | 'Window Installation' | 'Final Quality Check' | 'Window Verification';
    id: string;
    hasWarning?: boolean;
  }>;
};

const getColorForType = (type: string): string => {
  switch(type) {
    case 'Window Measurement': return '#7e22ce'; // Purple
    case 'Window Installation': return '#0369a1'; // Blue
    case 'Final Quality Check': return '#b45309'; // Amber
    case 'Window Verification': return '#047857'; // Green
    default: return '#1f2937'; // Dark gray
  }
};

const ScheduleCalendar: React.FC = () => {
  // Sample data for the schedule
  const days: DayData[] = [
    {
      date: '4',
      day: 'Sunday',
      month: 'May',
      services: 4,
      blocks: [
        { time: '08:00 AM', type: 'Window Measurement', id: 'ID: WM-4423' },
        { time: '09:30 AM', type: 'Final Quality Check', id: 'ID: FC-8822' },
        { time: '11:00 AM', type: 'Final Quality Check', id: 'ID: FC-8339' },
        { time: '01:00 PM', type: 'Window Measurement', id: 'ID: WM-7021', hasWarning: true },
        { time: '', type: 'Window Measurement', id: 'ID: WM-3427' },
        { time: '', type: 'Window Measurement', id: 'ID: WM-2207' }
      ]
    },
    {
      date: '5',
      day: 'Monday',
      month: 'May',
      services: 2,
      blocks: [
        { time: '08:00 AM', type: 'Final Quality Check', id: 'ID: FC-9973' },
        { time: '09:30 AM', type: 'Window Installation', id: 'ID: WI-4421' },
        { time: '01:00 PM', type: 'Window Installation', id: 'ID: WI-3217' }
      ]
    },
    {
      date: '6',
      day: 'Tuesday',
      month: 'May',
      services: 6,
      blocks: [
        { time: '08:00 AM', type: 'Window Measurement', id: 'ID: WM-4357' },
        { time: '09:30 AM', type: 'Final Quality Check', id: 'ID: FC-8202', hasWarning: true },
        { time: '11:00 AM', type: 'Window Measurement', id: 'ID: WM-4327' },
        { time: '01:00 PM', type: 'Window Installation', id: 'ID: WI-3217' },
        { time: '02:30 PM', type: 'Final Quality Check', id: 'ID: FC-2235' },
        { time: '02:30 PM', type: 'Final Quality Check', id: 'ID: FC-2235' },
        { time: '', type: 'Window Installation', id: 'ID: WI-3217' },
        { time: '03:30 PM', type: 'Final Quality Check', id: 'ID: FC-2235' },
        { time: '04:00 PM', type: 'Final Quality Check', id: 'ID: FC-8684', hasWarning: true }
      ]
    },
    {
      date: '7',
      day: 'Wednesday',
      month: 'May',
      services: 4,
      blocks: [
        { time: '08:00 AM', type: 'Window Measurement', id: 'ID: WM-9808' },
        { time: '09:30 AM', type: 'Window Verification', id: 'ID: WV-9829' },
        { time: '11:00 AM', type: 'Final Quality Check', id: 'ID: FC-9040', hasWarning: true },
        { time: '01:00 PM', type: 'Window Verification', id: 'ID: WV-1217' },
        { time: '', type: 'Window Verification', id: 'ID: WV-1217' },
        { time: '', type: 'Window Verification', id: 'ID: WV-1217' }
      ]
    }
  ];
  
  const [activeView, setActiveView] = React.useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  
  return (
    <div className="bg-black/20 rounded-lg p-5 mt-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Service Schedule</h2>
          <p className="text-sm text-zinc-400">View the schedule of services every day so you don't miss anything</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-800 rounded-lg overflow-hidden">
            {(['Daily', 'Weekly', 'Monthly'] as const).map(view => (
              <button
                key={view}
                className={`px-4 py-1.5 text-sm ${
                  activeView === view 
                    ? 'bg-green-600 text-white' 
                    : 'bg-transparent text-zinc-400 hover:text-zinc-200'
                }`}
                onClick={() => setActiveView(view)}
              >
                {view}
              </button>
            ))}
          </div>
          
          <button className="ml-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm flex items-center gap-1">
            <span className="text-sm">+</span> New Service
          </button>
        </div>
      </div>
      
      {/* Day selector tabs */}
      <div className="flex justify-between items-center mb-4">
        <button className="p-1 rounded-full bg-zinc-800 text-zinc-400">
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {days.map((day, idx) => (
            <button
              key={idx}
              className={`px-5 py-2 rounded-md text-center min-w-[100px] text-sm ${
                idx === 0 ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <div>{day.day}</div>
              <div className="font-medium">{day.date} {day.month}</div>
            </button>
          ))}
        </div>
        
        <button className="p-1 rounded-full bg-zinc-800 text-zinc-400">
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Calendar header */}
      <h3 className="text-zinc-400 font-medium mb-2 text-sm">Daily Schedule</h3>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-4 gap-4">
        {days.map((day, dayIdx) => (
          <div key={dayIdx} className="border-t border-zinc-700/50 pt-2">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white font-medium">{day.day}, {day.date} {day.month}</h4>
              <span className="text-xs text-zinc-400">{day.services} services</span>
            </div>
            
            <div className="space-y-3">
              {day.blocks.map((block, blockIdx) => (
                <ServiceBlock
                  key={`${dayIdx}-${blockIdx}`}
                  time={block.time}
                  type={block.type}
                  id={block.id}
                  hasWarning={block.hasWarning}
                  color={getColorForType(block.type)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-zinc-500">REF: SP-3929</div>
        <div className="text-xs text-zinc-500">REV: A.0 &nbsp;&nbsp; SCALE: 1:1 &nbsp;&nbsp; 05/4/2025</div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
