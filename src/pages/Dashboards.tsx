
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ProjectHeader from '../components/projects/ProjectHeader';
import ProjectMetricsSection from '../components/projects/ProjectMetricsSection';
import ProjectFilters from '../components/projects/ProjectFilters';
import ProjectTable from '../components/projects/ProjectTable';
import ProjectWidgetsSection from '../components/projects/ProjectWidgetsSection';
import { activeProjects } from '../data/projectsData';
import DashboardShell from '../components/layout/DashboardShell';

const Dashboards = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState(activeProjects);
  
  useEffect(() => {
    console.log('📊 Dashboards page mounted');
  }, []);
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // In a real application, this would filter the projects based on the selected filter
    setFilteredProjects(activeProjects);
  };
  
  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboards</h1>
            <p className="text-sm text-zinc-400">Manage and track all your dashboard views</p>
          </div>
          
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
            New Dashboard
          </button>
        </div>
        
        {/* Overview Metrics */}
        <ProjectMetricsSection />
        
        {/* Filters Toolbar */}
        <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
          <CardContent className="p-6">
            <ProjectFilters onFilterChange={handleFilterChange} activeFilter={activeFilter} />
          </CardContent>
        </Card>
        
        {/* Active Projects Table */}
        <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Active Dashboards</h2>
            <ProjectTable projects={filteredProjects} />
          </CardContent>
        </Card>
        
        {/* Bottom Widget Grid */}
        <ProjectWidgetsSection />
      </div>
    </DashboardShell>
  );
};

export default Dashboards;
