import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Filter, Search, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import KpiCard from '../components/dashboard/KpiCard';
import ProjectTable from '../components/projects/ProjectTable';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const activeProjects = [
    {
      id: 1,
      name: 'Lakeside Residence',
      color: 'blue' as const,
      client: 'John & Mary Smith',
      location: 'Bellevue, WA',
      windows: 24,
      progress: 75,
      deadline: 'Jun 30, 2025',
      status: 'In Progress'
    },
    {
      id: 2,
      name: 'Downtown Office Complex',
      color: 'purple' as const,
      client: 'Axis Commercial Properties',
      location: 'Seattle, WA',
      windows: 186,
      progress: 25,
      deadline: 'Aug 15, 2025',
      status: 'Just Started'
    },
    {
      id: 3,
      name: 'Harbor View Apartments',
      color: 'orange' as const,
      client: 'Emerald Bay Management',
      location: 'Tacoma, WA',
      windows: 94,
      progress: 60,
      deadline: 'Jul 10, 2025',
      status: 'Needs Review'
    },
    {
      id: 4,
      name: 'Sunnyvale Residence',
      color: 'red' as const,
      client: 'Robert & Lisa Anderson',
      location: 'Kirkland, WA',
      windows: 18,
      progress: 90,
      deadline: 'Jun 25, 2025',
      status: 'Final Check'
    },
    {
      id: 5,
      name: 'Westlake Tower',
      color: 'green' as const,
      client: 'Summit Properties LLC',
      location: 'Seattle, WA',
      windows: 132,
      progress: 40,
      deadline: 'Jul 30, 2025',
      status: 'In Progress'
    }
  ];
  
  const upcomingProjects = [
    {
      id: 6,
      name: 'Emerald Heights Condos',
      color: 'blue' as const,
      client: 'Evergreen Developers',
      location: 'Redmond, WA',
      windows: 78,
      progress: 0,
      deadline: 'Jul 15, 2025',
      status: 'Scheduled'
    },
    {
      id: 7,
      name: 'Cascade Business Center',
      color: 'green' as const,
      client: 'Northwest Commercial Group',
      location: 'Bellevue, WA',
      windows: 210,
      progress: 0,
      deadline: 'Aug 5, 2025',
      status: 'Contract Signed'
    },
    {
      id: 8,
      name: 'Oakridge Manor',
      color: 'pink' as const,
      client: 'James & Patricia Wilson',
      location: 'Sammamish, WA',
      windows: 32,
      progress: 0,
      deadline: 'Jul 8, 2025',
      status: 'Pre-Assessment'
    }
  ];
  
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-zinc-400">Manage and track all your window projects</p>
        </div>
        
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
          <PlusCircle size={16} />
          New Project
        </Button>
      </div>
      
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-stretch">
              <div className="py-4 px-5 flex-grow">
                <div className="text-sm font-medium text-zinc-400">Active Projects</div>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-semibold text-white">24</span>
                  <span className="ml-2 text-xs font-medium flex items-center text-emerald-500">
                    <ArrowUp size={12} className="mr-0.5" />
                    8%
                  </span>
                </div>
                <div className="mt-1 text-xs text-zinc-500">vs last month</div>
              </div>
              <div className="w-2 bg-indigo-500/20"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-stretch">
              <div className="py-4 px-5 flex-grow">
                <div className="text-sm font-medium text-zinc-400">Upcoming Projects</div>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-semibold text-white">11</span>
                  <span className="ml-2 text-xs font-medium flex items-center text-emerald-500">
                    <ArrowUp size={12} className="mr-0.5" />
                    3%
                  </span>
                </div>
                <div className="mt-1 text-xs text-zinc-500">vs last month</div>
              </div>
              <div className="w-2 bg-purple-500/20"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-stretch">
              <div className="py-4 px-5 flex-grow">
                <div className="text-sm font-medium text-zinc-400">Windows Measured</div>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-semibold text-white">1,254</span>
                  <span className="ml-2 text-xs font-medium flex items-center text-emerald-500">
                    <ArrowUp size={12} className="mr-0.5" />
                    12%
                  </span>
                </div>
                <div className="mt-1 text-xs text-zinc-500">total measured</div>
              </div>
              <div className="w-2 bg-emerald-500/20"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-stretch">
              <div className="py-4 px-5 flex-grow">
                <div className="text-sm font-medium text-zinc-400">Pending Measurements</div>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-semibold text-white">386</span>
                  <span className="ml-2 text-xs font-medium flex items-center text-red-500">
                    <ArrowDown size={12} className="mr-0.5" />
                    5%
                  </span>
                </div>
                <div className="mt-1 text-xs text-zinc-500">remaining to measure</div>
              </div>
              <div className="w-2 bg-amber-500/20"></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters Toolbar - Placeholder */}
      <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Project Filters</h2>
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
        </CardContent>
      </Card>
      
      {/* Active Projects Table - Placeholder */}
      <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Active Projects</h2>
          <div className="text-zinc-400 text-sm">
            Project listing will appear here in Phase 4.
          </div>
        </CardContent>
      </Card>
      
      {/* Bottom Widget Grid - Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Measurement Statistics */}
        <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Measurement Statistics</h2>
            <div className="text-zinc-400 text-sm">
              Measurement statistics will appear here in Phase 5.
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Measurements */}
        <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Measurements</h2>
            <div className="text-zinc-400 text-sm">
              Recent measurements will appear here in Phase 5.
            </div>
          </CardContent>
        </Card>
        
        {/* Team Activity */}
        <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Team Activity</h2>
            <div className="text-zinc-400 text-sm">
              Team activity feed will appear here in Phase 5.
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Schedule */}
        <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Upcoming Schedule</h2>
            <div className="text-zinc-400 text-sm">
              Schedule information will appear here in Phase 5.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Projects;
