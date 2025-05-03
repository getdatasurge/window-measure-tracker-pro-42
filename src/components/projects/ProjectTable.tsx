import React from 'react';
import { MoreHorizontal, Check, Edit } from 'lucide-react';
export type ProjectColor = "blue" | "purple" | "orange" | "red" | "green" | "cyan" | "pink" | "teal";
export interface Project {
  id: number;
  name: string;
  color: ProjectColor;
  client: string;
  location: string;
  windows: number;
  progress: number;
  deadline: string;
  status: string;
}
interface ProjectTableProps {
  projects: Project[];
}
const ProjectTable: React.FC<ProjectTableProps> = ({
  projects
}) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-green-100 text-green-800';
      case 'just started':
        return 'bg-blue-100 text-blue-800';
      case 'needs review':
        return 'bg-orange-100 text-orange-800';
      case 'final check':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getProjectIconClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      case 'orange':
        return 'bg-orange-100 text-orange-600';
      case 'red':
        return 'bg-red-100 text-red-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  return <div className="overflow-x-auto">
      
    </div>;
};
export default ProjectTable;