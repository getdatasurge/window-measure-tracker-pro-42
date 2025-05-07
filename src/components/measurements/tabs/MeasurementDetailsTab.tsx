import React, { useEffect, useState } from 'react';
import { MeasurementFormData } from '@/hooks/measurements/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

interface MeasurementDetailsTabProps {
  formData: MeasurementFormData;
  updateFormData: (field: string, value: any) => void;
  errors: {[key: string]: string};
  setErrors: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
}

const MeasurementDetailsTab: React.FC<MeasurementDetailsTabProps> = ({ 
  formData, 
  updateFormData,
  errors,
  setErrors
}) => {
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const { projects, isLoading } = useProjects();
  
  // Load last selected project from localStorage if no project is selected
  useEffect(() => {
    if (!formData.projectId && !formData.projectName) {
      try {
        const lastProject = localStorage.getItem('lastSelectedProject');
        if (lastProject) {
          const { id, name } = JSON.parse(lastProject);
          updateFormData('projectId', id);
          updateFormData('projectName', name);
        }
      } catch (error) {
        console.error('Error loading last project from localStorage:', error);
      }
    }
  }, [formData.projectId, formData.projectName, updateFormData]);
  
  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(projectSearchTerm.toLowerCase())
  );
  
  const handleProjectSelect = (projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId);
    if (selectedProject) {
      updateFormData('projectId', selectedProject.id);
      updateFormData('projectName', selectedProject.name);
      
      // Clear any project-related errors
      if (errors.projectId) {
        const newErrors = {...errors};
        delete newErrors.projectId;
        setErrors(newErrors);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="project" className="text-sm text-zinc-400">
          Project <span className="text-red-500">*</span>
        </Label>
        
        <div className="relative">
          <div className="flex items-center border border-zinc-700 rounded-md bg-zinc-800/50 px-3 py-2 mb-2">
            <Search className="h-4 w-4 text-zinc-400 mr-2" />
            <input
              type="text"
              placeholder="Search projects..."
              className="bg-transparent border-none outline-none text-white w-full"
              value={projectSearchTerm}
              onChange={(e) => setProjectSearchTerm(e.target.value)}
            />
          </div>
          
          {errors.projectId && (
            <p className="text-xs text-red-500 mt-1">{errors.projectId}</p>
          )}
          
          <div className="max-h-40 overflow-y-auto border border-zinc-700 rounded-md bg-zinc-800/50">
            {isLoading ? (
              <div className="p-3 text-center text-zinc-400">Loading projects...</div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <div 
                  key={project.id}
                  className={`p-3 cursor-pointer hover:bg-zinc-700 ${
                    formData.projectId === project.id ? 'bg-zinc-700' : ''
                  }`}
                  onClick={() => handleProjectSelect(project.id)}
                >
                  <div className="font-medium text-white">{project.name}</div>
                  <div className="text-xs text-zinc-400">ID: {project.id}</div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-zinc-400">
                {projectSearchTerm ? 'No matching projects found' : 'No projects available'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {formData.projectId && (
        <div className="p-3 border border-zinc-700 rounded-md bg-zinc-800/20">
          <div className="text-sm text-zinc-400">Selected Project</div>
          <div className="font-medium text-white">{formData.projectName}</div>
          <div className="text-xs text-zinc-500">ID: {formData.projectId}</div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="recordedBy" className="text-sm text-zinc-400">Recorded By</Label>
        <Input
          id="recordedBy"
          value={formData.recordedBy || ''}
          onChange={(e) => updateFormData('recordedBy', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white"
          placeholder="Enter name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm text-zinc-400">Status</Label>
        <Select
          value={formData.status || 'Pending'}
          onValueChange={(value) => updateFormData('status', value)}
        >
          <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
            <SelectItem value="Pending" className="text-white">Pending</SelectItem>
            <SelectItem value="Film_Cut" className="text-white">Film Cut</SelectItem>
            <SelectItem value="Installed" className="text-white">Installed</SelectItem>
            <SelectItem value="Completed" className="text-white">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MeasurementDetailsTab;
