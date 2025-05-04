import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ProjectTable from '../projects/ProjectTable';
import { activeProjects } from '../../data/projectsData';
interface DashboardProjectsSectionProps {
  className?: string;
}
const DashboardProjectsSection: React.FC<DashboardProjectsSectionProps> = ({
  className
}) => {
  return <Card className="col-span-1 lg:col-span-4 ">
      <CardContent className="p-4 grid col-span-2 ">
        <h2 className="text-lg font-semibold text-white mb-4">Active Projects</h2>
        <ProjectTable projects={activeProjects} />
      </CardContent>
    </Card>;
};
export default DashboardProjectsSection;