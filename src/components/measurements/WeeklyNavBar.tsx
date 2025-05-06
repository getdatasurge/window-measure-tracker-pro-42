
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';

export interface WeeklyNavBarProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const WeeklyNavBar: React.FC<WeeklyNavBarProps> = ({ selectedDate, onChange }) => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  
  const formattedWeekRange = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
  
  const handlePrevWeek = () => {
    const newDate = subWeeks(selectedDate, 1);
    onChange(newDate);
  };
  
  const handleNextWeek = () => {
    const newDate = addWeeks(selectedDate, 1);
    onChange(newDate);
  };
  
  const handleTodayClick = () => {
    onChange(new Date());
  };
  
  return (
    <div className="flex justify-between items-center my-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrevWeek}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-zinc-200">{formattedWeekRange}</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNextWeek}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleTodayClick}
        className="text-xs h-8"
      >
        Today
      </Button>
    </div>
  );
};

export default WeeklyNavBar;
