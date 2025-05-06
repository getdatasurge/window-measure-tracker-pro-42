
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeeklyNavBarProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

const WeeklyNavBar: React.FC<WeeklyNavBarProps> = ({ onSelectDate, selectedDate }) => {
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  
  // Get week dates based on selected date
  useEffect(() => {
    const dates: Date[] = [];
    const currentDay = selectedDate.getDay();
    const diff = currentDay === 0 ? 6 : currentDay - 1; // Adjust for Monday as first day
    
    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() - diff);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    
    setWeekDates(dates);
  }, [selectedDate]);
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getDayName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };
  
  const isCurrentDate = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  const isSelectedDate = (date: Date): boolean => {
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  const navigatePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    onSelectDate(newDate);
  };
  
  const navigateNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    onSelectDate(newDate);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-white">Weekly Schedule</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={navigatePreviousWeek} className="h-8 px-2 bg-zinc-800 border-zinc-700">
            <ChevronLeft size={16} />
            <span className="ml-1">Previous Week</span>
          </Button>
          <Button variant="outline" size="sm" onClick={navigateNextWeek} className="h-8 px-2 bg-zinc-800 border-zinc-700">
            <span className="mr-1">Next Week</span>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, index) => (
          <Button
            key={index}
            variant={isSelectedDate(date) ? "default" : "outline"}
            className={`
              flex flex-col items-center justify-center h-20 p-1
              ${isSelectedDate(date) ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700'}
              ${isCurrentDate(date) && !isSelectedDate(date) ? 'border-green-600/50' : ''}
            `}
            onClick={() => onSelectDate(date)}
          >
            <span className="text-xs font-normal">{getDayName(date)}</span>
            <span className="text-lg font-medium">{formatDate(date)}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WeeklyNavBar;
