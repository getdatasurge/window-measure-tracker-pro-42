
import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectFiltersProps {
  onFilterChange?: (filters: any) => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({ onFilterChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Project Filters</h2>
        <Button variant="outline" size="sm" className="text-xs bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hidden md:flex">
          <Filter size={14} className="mr-1" />
          Reset Filters
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-9 bg-zinc-900/50 border-zinc-700 text-zinc-300 placeholder:text-zinc-500"
          />
        </div>
        
        <Select>
          <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-zinc-300">
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
          <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-zinc-300">
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
          <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-zinc-300">
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
        
        <Button variant="outline" className="bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 flex justify-between items-center">
          More Filters
          <ChevronDown size={16} />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
          All Projects
        </Button>
        <Button variant="outline" size="sm" className="bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
          Active
        </Button>
        <Button variant="outline" size="sm" className="bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
          Upcoming
        </Button>
        <Button variant="outline" size="sm" className="bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
          Completed
        </Button>
      </div>
    </div>
  );
};

export default ProjectFilters;
