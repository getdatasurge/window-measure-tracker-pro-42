
import React from 'react';
import { Project } from "../../data/projectsData";

interface ProjectTableProps {
  projects: Project[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  // This is a placeholder component that will be implemented in Phase 4
  return (
    <div className="text-zinc-400">
      <p>Project table will be implemented in Phase 4</p>
      <p className="text-sm mt-2">Projects to show: {projects.length}</p>
    </div>
  );
};

export default ProjectTable;
