
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ProjectTable from '../projects/ProjectTable';
import { activeProjects, Project } from '../../data/projectsData';

interface DashboardProjectsSectionProps {
  className?: string;
}

const DashboardProjectsSection: React.FC<DashboardProjectsSectionProps> = ({ className }) => {
  return (
    <Card className={`bg-zinc-800/50 border border-zinc-700/50 shadow-lg ${className}`}>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Active Projects</h2>
        <ProjectTable projects={activeProjects} />
      </CardContent>
    </Card>
  );
};

export default DashboardProjectsSection;
