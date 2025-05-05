
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ProjectHeader from '../components/projects/ProjectHeader';
import ProjectMetricsSection from '../components/projects/ProjectMetricsSection';
import ProjectFilters from '../components/projects/ProjectFilters';
import ProjectTable from '../components/projects/ProjectTable';
import ProjectWidgetsSection from '../components/projects/ProjectWidgetsSection';
import { activeProjects } from '../data/projectsData';
import withResponsiveLayout from '@/hoc/withResponsiveLayout';

const ProjectsNewPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState(activeProjects);
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // In a real application, this would filter the projects based on the selected filter
    setFilteredProjects(activeProjects);
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <ProjectHeader />
      
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
          <h2 className="text-lg font-semibold text-white mb-4">Active Projects</h2>
          <ProjectTable projects={filteredProjects} />
        </CardContent>
      </Card>
      
      {/* Bottom Widget Grid */}
      <ProjectWidgetsSection />
    </div>
  );
};

export default withResponsiveLayout(ProjectsNewPage);
