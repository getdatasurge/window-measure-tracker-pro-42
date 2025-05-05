
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ProjectList } from '@/components/projects/ProjectList';
import withResponsiveLayout from '@/hoc/withResponsiveLayout';

const ProjectsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <p className="text-sm text-zinc-400">Manage and track all your window projects</p>
      </div>
      
      <ProjectList />
    </div>
  );
};

export default withResponsiveLayout(ProjectsPage);
