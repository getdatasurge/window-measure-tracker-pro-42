
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceBlock from './ServiceBlock';

interface ServiceItem {
  id: string;
  time: string;
  type: string;
  location: string;
  color: string;
  hasWarning?: boolean;
}

const ScheduleCalendar: React.FC = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00 ${i + 8 >= 12 ? 'PM' : 'AM'}`);
  
  // Sample service data
  const services: Record<string, ServiceItem[]> = {
    'Sunday': [
      { 
        id: 'LAK-1042', 
        time: '9:00 - 11:30 AM', 
        type: 'Window Measurement',
        location: 'Lakeside Residence',
        color: '#3b82f6' 
      },
      { 
        id: 'HVC-2103', 
        time: '2:00 - 5:00 PM', 
        type: 'Window Installation',
        location: 'Harbor View Complex',
        color: '#22c55e' 
      },
    ],
    'Monday': [
      { 
        id: 'DOT-3322', 
        time: '10:00 AM - 12:30 PM', 
        type: 'Final Quality Check',
        location: 'Downtown Office Tower',
        color: '#f59e0b',
        hasWarning: true 
      },
    ],
    'Tuesday': [
      { 
        id: 'SUV-1245', 
        time: '8:30 - 11:00 AM', 
        type: 'Window Installation',
        location: 'Sunnyvale Residence',
        color: '#22c55e' 
      },
      { 
        id: 'RPK-7701', 
        time: '1:00 - 3:30 PM', 
        type: 'Window Verification',
        location: 'Riverside Park Complex',
        color: '#9333ea' 
      },
    ],
    'Wednesday': [
      { 
        id: 'MRN-5520', 
        time: '9:00 AM - 12:00 PM', 
        type: 'Window Measurement',
        location: 'Marina Heights',
        color: '#3b82f6' 
      },
      { 
        id: 'OAK-6104', 
        time: '3:00 - 5:30 PM', 
        type: 'Window Installation',
        location: 'Oakland Towers',
        color: '#22c55e',
        hasWarning: true
      },
    ],
  };

  return (
    <div className="bg-black/20 border border-zinc-800/70 rounded-lg p-5 mt-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-semibold text-white">Service Schedule</h3>
          <span className="text-xs text-zinc-400">June 2025</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-1.5 rounded-md bg-zinc-800/70 text-zinc-400 hover:bg-zinc-700/50 hover:text-white">
            <ChevronLeft size={16} />
          </button>
          <button className="p-1.5 rounded-md bg-zinc-800/70 text-zinc-400 hover:bg-zinc-700/50 hover:text-white">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Day selection tabs */}
      <div className="flex mb-4 overflow-x-auto pb-2 scrollbar-none">
        {days.map((day, index) => (
          <button 
            key={day} 
            className={`px-4 py-2 whitespace-nowrap ${
              index < 4 
                ? 'bg-green-900/20 text-green-400 border-b-2 border-green-400 font-medium' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            } rounded-t-md text-sm`}
          >
            {day}
          </button>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Time column headers */}
        <div className="text-xs text-zinc-500 font-medium text-center">Time</div>
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday'].map(day => (
          <div key={day} className="text-xs text-zinc-500 font-medium text-center">
            {day}
          </div>
        ))}
        
        {/* Time slots and services */}
        {hours.map((hour, hourIndex) => (
          <React.Fragment key={hour}>
            {/* Time slot */}
            <div className="text-xs text-zinc-400 pr-2 text-right border-t border-zinc-800/40 pt-2">
              {hour}
            </div>
            
            {/* Day columns */}
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday'].map(day => {
              const dayServices = services[day] || [];
              const serviceForThisHour = dayServices.find(s => {
                const serviceStartHour = parseInt(s.time.split(':')[0]);
                const currentHourNum = hourIndex + 8;
                return serviceStartHour === currentHourNum;
              });
              
              return (
                <div key={`${day}-${hour}`} className="border-t border-zinc-800/40 pt-2 min-h-[60px]">
                  {serviceForThisHour && (
                    <ServiceBlock
                      time={serviceForThisHour.time}
                      type={serviceForThisHour.type}
                      id={serviceForThisHour.id}
                      color={serviceForThisHour.color}
                      hasWarning={serviceForThisHour.hasWarning}
                    />
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ScheduleCalendar;
