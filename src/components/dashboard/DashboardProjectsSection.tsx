
import React, { useState } from 'react';
import ProjectTable from '../projects/ProjectTable';
import DashboardHeader from './DashboardHeader';
import DashboardSearch from './DashboardSearch';
import DashboardPagination from './DashboardPagination';
import { Project } from '../projects/ProjectTable';
import { Button } from '../ui/button';

interface DashboardProjectsSectionProps {
  projects: Project[];
}

const DashboardProjectsSection: React.FC<DashboardProjectsSectionProps> = ({
  projects
}) => {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredProjects(projects);
      return;
    }
    
    const filtered = projects.filter(project => 
      project.name.toLowerCase().includes(term.toLowerCase()) || 
      project.client.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProjects(filtered);
  };
  
  return (
    <div className="space-y-4">
      <DashboardHeader title="Active Projects">
        <div className="flex items-center gap-2">
          <DashboardSearch onSearch={handleSearch} />
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button variant="link" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Button>
        </div>
      </DashboardHeader>
      
      <ProjectTable projects={filteredProjects} />
      
      {filteredProjects.length > 0 && (
        <div className="flex justify-between items-center pt-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
          <DashboardPagination totalCount={projects.length} visibleCount={filteredProjects.length} />
        </div>
      )}
    </div>
  );
};

export default DashboardProjectsSection;
