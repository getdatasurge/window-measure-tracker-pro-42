
import React from 'react';
import { MoreHorizontal, Check, Edit } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

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
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'on track':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'just started':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'delayed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'needs review':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'final check':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  const getProjectIconClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'purple':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'orange':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      case 'red':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'green':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };
  
  const getProjectIcon = (color: ProjectColor) => {
    switch (color) {
      case 'blue':
        return <div className="text-blue-600 p-2 rounded-md bg-blue-50 dark:bg-blue-900/20">🏢</div>;
      case 'purple':
        return <div className="text-purple-600 p-2 rounded-md bg-purple-50 dark:bg-purple-900/20">🏥</div>;
      case 'orange':
        return <div className="text-orange-600 p-2 rounded-md bg-orange-50 dark:bg-orange-900/20">🏪</div>;
      case 'red':
        return <div className="text-red-600 p-2 rounded-md bg-red-50 dark:bg-red-900/20">🏫</div>;
      case 'green':
        return <div className="text-green-600 p-2 rounded-md bg-green-50 dark:bg-green-900/20">🏡</div>;
      default:
        return <div className="text-gray-600 p-2 rounded-md bg-gray-50 dark:bg-gray-800/20">🏠</div>;
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg backdrop-blur-md bg-white/80 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/40 shadow-md">
      <Table>
        <TableHeader className="bg-gray-50/70 dark:bg-gray-800/30">
          <TableRow className="border-b border-gray-200 dark:border-gray-700/30">
            <TableHead className="w-[250px]">Project</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Progress</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              className="border-b border-gray-200 dark:border-gray-700/30 hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors"
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  {getProjectIcon(project.color)}
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{project.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{project.location}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">{project.client}</TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">{project.deadline}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
                  {project.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm font-medium">{project.progress}%</span>
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        project.progress > 80 ? 'bg-green-500 dark:bg-green-600' : 
                        project.progress > 60 ? 'bg-blue-500 dark:bg-blue-600' : 
                        project.progress > 40 ? 'bg-amber-500 dark:bg-amber-600' : 
                        'bg-orange-500 dark:bg-orange-600'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50">
                  <MoreHorizontal className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectTable;
