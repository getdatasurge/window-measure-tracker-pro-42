import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Calendar as CalendarIcon, Filter, ChevronDown } from 'lucide-react';
import { installers, projects, statuses } from '@/data/measurementsData';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
interface MeasurementFilterBarProps {
  onFilterChange: (filters: FilterState) => void;
}
interface FilterState {
  project: string;
  installer: string;
  status: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}
const MeasurementFilterBar: React.FC<MeasurementFilterBarProps> = ({
  onFilterChange
}) => {
  const [filters, setFilters] = useState<FilterState>({
    project: 'all',
    installer: 'all',
    status: 'all',
    dateRange: {
      from: undefined,
      to: undefined
    }
  });
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  return <div className="flex flex-wrap gap-2 mb-6">
      {/* Project Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300">
            {projects.find(p => p.id === filters.project)?.name || 'All Projects'}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-zinc-800 border-zinc-700 text-zinc-200">
          <DropdownMenuLabel>Select Project</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-zinc-700" />
          {projects.map(project => <DropdownMenuCheckboxItem key={project.id} checked={filters.project === project.id} onCheckedChange={() => handleFilterChange('project', project.id)}>
              {project.name}
            </DropdownMenuCheckboxItem>)}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Installer Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300">
            {installers.find(i => i.id === filters.installer)?.name || 'All Installers'}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-zinc-800 border-zinc-700 text-zinc-200">
          <DropdownMenuLabel>Select Installer</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-zinc-700" />
          {installers.map(installer => <DropdownMenuCheckboxItem key={installer.id} checked={filters.installer === installer.id} onCheckedChange={() => handleFilterChange('installer', installer.id)}>
              {installer.name}
            </DropdownMenuCheckboxItem>)}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300">
            {statuses.find(s => s.value === filters.status)?.label || 'All Statuses'}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-zinc-800 border-zinc-700 text-zinc-200">
          <DropdownMenuLabel>Select Status</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-zinc-700" />
          {statuses.map(status => <DropdownMenuCheckboxItem key={status.value} checked={filters.status === status.value} onCheckedChange={() => handleFilterChange('status', status.value)}>
              {status.label}
            </DropdownMenuCheckboxItem>)}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.dateRange.from ? filters.dateRange.to ? <>
                  {format(filters.dateRange.from, "MMM d, yyyy")} - {format(filters.dateRange.to, "MMM d, yyyy")}
                </> : format(filters.dateRange.from, "MMM d, yyyy") : <span>Select date range</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-zinc-800 border-zinc-700" align="start">
          <Calendar initialFocus mode="range" defaultMonth={filters.dateRange.from} selected={filters.dateRange} onSelect={range => handleFilterChange('dateRange', range || {
          from: undefined,
          to: undefined
        })} numberOfMonths={1} className="bg-zinc-800 text-zinc-200" />
        </PopoverContent>
      </Popover>
      
      {/* Advanced Filter Button */}
      
      
      {/* New Entry Button */}
      
    </div>;
};
export default MeasurementFilterBar;