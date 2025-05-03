
import React from 'react';
import { MoreHorizontal } from 'lucide-react';

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

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
            <th className="px-3 py-2">Project Name</th>
            <th className="px-3 py-2">Client</th>
            <th className="px-3 py-2">Location</th>
            <th className="px-3 py-2">Windows</th>
            <th className="px-3 py-2">Progress</th>
            <th className="px-3 py-2">Deadline</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="bg-white">
              <td className="px-3 py-3">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded flex items-center justify-center mr-3 ${getProjectIconClass(project.color)}`}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                  </div>
                  <span className="font-medium">{project.name}</span>
                </div>
              </td>
              <td className="px-3 py-3 text-sm">{project.client}</td>
              <td className="px-3 py-3 text-sm">{project.location}</td>
              <td className="px-3 py-3 text-sm">{project.windows}</td>
              <td className="px-3 py-3">
                <div className="flex items-center">
                  <div className="progress-bar w-24 mr-2">
                    <div 
                      className="progress-bar-value bg-green-500" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{project.progress}%</span>
                </div>
              </td>
              <td className="px-3 py-3 text-sm">{project.deadline}</td>
              <td className="px-3 py-3">
                <span className={`status-badge ${getStatusBadgeClass(project.status)}`}>{project.status}</span>
              </td>
              <td className="px-3 py-3">
                <div className="flex space-x-2">
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <Check size={18} className="text-blue-600" />
                  </button>
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <Edit size={18} className="text-gray-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
