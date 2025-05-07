
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Measurement } from '@/types/measurement';
import { useAuth } from '@/contexts/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchProjects } from '@/services/projectService';

interface MeasurementDetailsTabProps {
  formData: Measurement;
  updateFormData: (field: string, value: any) => void;
  errors?: {[key: string]: string};
  setErrors?: (errors: {[key: string]: string}) => void;
}

const MeasurementDetailsTab: React.FC<MeasurementDetailsTabProps> = ({ 
  formData, 
  updateFormData,
  errors = {},
  setErrors = () => {}
}) => {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Autofill recorded by field with current user's name when component mounts
  useEffect(() => {
    if (profile?.full_name && !formData.recordedBy) {
      updateFormData('recordedBy', profile.full_name);
    }
  }, [profile, formData.recordedBy, updateFormData]);

  // Load projects for dropdown
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const projectsData = await fetchProjects(true);
        setProjects(projectsData.map((p: any) => ({
          id: p.id,
          name: p.name
        })));
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);
  
  // Load last selected project from localStorage
  useEffect(() => {
    const lastProject = localStorage.getItem('lastSelectedProject');
    if (lastProject && !formData.projectId) {
      try {
        const project = JSON.parse(lastProject);
        updateFormData('projectId', project.id);
        updateFormData('projectName', project.name);
      } catch (e) {
        console.error("Error parsing stored project:", e);
      }
    }
  }, [formData.projectId, updateFormData]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFormData('location', value);
    
    // Clear error when user starts typing
    if (value && errors.location) {
      const newErrors = {...errors};
      delete newErrors.location;
      setErrors(newErrors);
    }
  };

  const handleProjectChange = (projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId);
    if (selectedProject) {
      updateFormData('projectId', projectId);
      updateFormData('projectName', selectedProject.name);
      
      // Save to localStorage
      localStorage.setItem('lastSelectedProject', JSON.stringify({
        id: projectId,
        name: selectedProject.name
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm text-zinc-400">
          Location <span className="text-red-500">*</span>
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={handleLocationChange}
          className={`bg-zinc-800/50 border-zinc-700 text-white ${errors.location ? 'border-red-500' : ''}`}
          placeholder="Enter location (required)"
          required
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="measurementDate" className="text-sm text-zinc-400">
          Measurement Date
        </Label>
        <Input
          id="measurementDate"
          type="date"
          value={formData.measurementDate}
          onChange={(e) => updateFormData('measurementDate', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="recordedBy" className="text-sm text-zinc-400">
          Recorded By
        </Label>
        <Input
          id="recordedBy"
          value={formData.recordedBy}
          readOnly
          className="bg-zinc-800/50 border-zinc-700 text-white opacity-70"
          placeholder="Automatically filled"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project" className="text-sm text-zinc-400">
          Project <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.projectId}
          onValueChange={handleProjectChange}
          disabled={loading}
        >
          <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id} className="text-white">
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.projectId && (
          <p className="text-red-500 text-xs mt-1">{errors.projectId}</p>
        )}
      </div>
    </div>
  );
};

export default MeasurementDetailsTab;
