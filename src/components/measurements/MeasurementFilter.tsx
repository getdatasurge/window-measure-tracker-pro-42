
import React, { useState } from 'react';
import MeasurementFilterBar from './MeasurementFilterBar';
import WeeklyNavBar from './WeeklyNavBar';

interface FilterState {
  projectId: string | null;
  location: string | null;
  status: string | null;
  dateRange: { from: Date | null; to: Date | null } | null;
}

interface MeasurementFilterProps {
  onFilterChange: (filter: FilterState) => void;
}

export function MeasurementFilter({ onFilterChange }: MeasurementFilterProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState<FilterState>({
    projectId: null,
    location: null,
    status: null,
    dateRange: null,
  });

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleFilterChange = (newFilter: Partial<FilterState>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    onFilterChange(updatedFilter);
  };

  return (
    <div>
      <MeasurementFilterBar onFilterChange={handleFilterChange} />
      <WeeklyNavBar
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
    </div>
  );
}
