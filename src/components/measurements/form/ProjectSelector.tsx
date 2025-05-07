
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ProjectOption } from '@/hooks/measurements/useProjectList';

interface ProjectSelectorProps {
  projectId: string;
  projects: ProjectOption[];
  onProjectChange: (projectId: string) => void;
  error?: string;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ 
  projectId, 
  projects, 
  onProjectChange,
  error
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="projectId">Project</Label>
      <Select
        value={projectId}
        onValueChange={onProjectChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default ProjectSelector;
