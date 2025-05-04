
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ProjectHeader from '../components/projects/ProjectHeader';
import ProjectMetricsSection from '../components/projects/ProjectMetricsSection';
import ProjectFilters from '../components/projects/ProjectFilters';
import ProjectTable from '../components/projects/ProjectTable';
import ProjectWidgetsSection from '../components/projects/ProjectWidgetsSection';
import { activeProjects } from '../data/projectsData';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <ProjectHeader />
      
      {/* Overview Metrics */}
      <ProjectMetricsSection />
      
      {/* Filters Toolbar */}
      <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
        <CardContent className="p-4">
          <ProjectFilters />
        </CardContent>
      </Card>
      
      {/* Active Projects Table */}
      <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Active Projects</h2>
          <ProjectTable projects={activeProjects} />
        </CardContent>
      </Card>
      
      {/* Bottom Widget Grid */}
      <ProjectWidgetsSection />
    </div>
  );
};

export default Projects;
