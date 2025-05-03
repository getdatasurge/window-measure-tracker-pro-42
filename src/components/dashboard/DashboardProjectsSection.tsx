
import React from 'react';
import ProjectTable from '../projects/ProjectTable';
import DashboardHeader from './DashboardHeader';
import DashboardSearch from './DashboardSearch';
import DashboardPagination from './DashboardPagination';
import { Project } from '../projects/ProjectTable';

interface DashboardProjectsSectionProps {
  projects: Project[];
}

const DashboardProjectsSection: React.FC<DashboardProjectsSectionProps> = ({ projects }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <DashboardHeader title="Active Projects">
        <div className="flex space-x-2 items-center">
          <DashboardSearch />
          <button className="px-4 py-2 bg-wintrack-dark-blue text-white rounded-md text-sm font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 5v14M5 12h14"/></svg>
            Add Project
          </button>
        </div>
      </DashboardHeader>
      
      <ProjectTable projects={projects} />
      
      <DashboardPagination totalCount={24} visibleCount={5} />
    </div>
  );
};

export default DashboardProjectsSection;
