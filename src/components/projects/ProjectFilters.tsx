
import React from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectFiltersProps {
  onFilterChange?: (filters: any) => void;
  activeFilter?: string;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({ onFilterChange, activeFilter = 'all' }) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  
  const handleFilterClick = (filter: string) => {
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">Project Filters</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
          onClick={() => onFilterChange && onFilterChange('all')}
        >
          <Filter size={14} />
          <span>Reset Filters</span>
        </Button>
      </div>
      
      {/* Primary filter controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="relative md:col-span-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-9 py-5 bg-zinc-900/50 border-zinc-700 text-zinc-300 placeholder:text-zinc-500 w-full"
          />
        </div>
        
        <Select>
          <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-zinc-300 h-10 md:col-span-2">
            <SelectValue placeholder="Project Type" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="industrial">Industrial</SelectItem>
          </SelectContent>
        </Select>
        
        <Select>
          <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-zinc-300 h-10 md:col-span-2">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="just-started">Just Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="needs-review">Needs Review</SelectItem>
            <SelectItem value="final-check">Final Check</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select>
          <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-zinc-300 h-10 md:col-span-2">
            <SelectValue placeholder="Team Member" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="all">All Members</SelectItem>
            <SelectItem value="alex">Alex Johnson</SelectItem>
            <SelectItem value="sarah">Sarah Wilson</SelectItem>
            <SelectItem value="michael">Michael Brown</SelectItem>
            <SelectItem value="emma">Emma Davis</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 flex justify-between items-center md:col-span-2"
            >
              <span>Advanced Filters</span>
              <ChevronDown size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-zinc-800 border-zinc-700 p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-300">Advanced Filters</h3>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-zinc-300">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-zinc-300">
                    <SelectValue placeholder="Budget Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="all">All Budgets</SelectItem>
                    <SelectItem value="low">Under $10K</SelectItem>
                    <SelectItem value="medium">$10K - $50K</SelectItem>
                    <SelectItem value="high">$50K - $250K</SelectItem>
                    <SelectItem value="enterprise">$250K+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Filter pills */}
      <div className="flex flex-wrap gap-3">
        <Button 
          variant={activeFilter === 'all' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleFilterClick('all')}
          className={activeFilter === 'all' 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800'}
        >
          All Projects
        </Button>
        <Button 
          variant={activeFilter === 'active' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleFilterClick('active')}
          className={activeFilter === 'active' 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800'}
        >
          Active
        </Button>
        <Button 
          variant={activeFilter === 'upcoming' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleFilterClick('upcoming')}
          className={activeFilter === 'upcoming' 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800'}
        >
          Upcoming
        </Button>
        <Button 
          variant={activeFilter === 'completed' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleFilterClick('completed')}
          className={activeFilter === 'completed' 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800'}
        >
          Completed
        </Button>
      </div>
    </div>
  );
};

export default ProjectFilters;
