
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ProjectFormData } from '../CreateProjectModal';

interface ProjectInfoTabProps {
  formData: ProjectFormData;
  updateFormData: (field: keyof ProjectFormData, value: any) => void;
  errors: Partial<Record<keyof ProjectFormData, string>>;
}

const projectTypes = [
  'Residential',
  'Commercial',
  'Industrial',
  'Institutional',
  'Mixed-Use'
];

const projectStatuses = [
  'Planned',
  'In Progress',
  'On Hold',
  'Completed',
  'Cancelled'
];

const ProjectInfoTab: React.FC<ProjectInfoTabProps> = ({ 
  formData, 
  updateFormData,
  errors
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm text-zinc-400 flex items-center">
          Project Name <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white"
          placeholder="Enter project name"
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm text-zinc-400 flex items-center">
            Project Type <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => updateFormData('type', value)}
          >
            <SelectTrigger id="type" className="bg-zinc-800/50 border-zinc-700 text-white">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              {projectTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-xs text-red-500 mt-1">{errors.type}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm text-zinc-400">
            Project Status
          </Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => updateFormData('status', value)}
          >
            <SelectTrigger id="status" className="bg-zinc-800/50 border-zinc-700 text-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              {projectStatuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm text-zinc-400">
          Project Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white min-h-[150px]"
          placeholder="Enter project description (optional)"
        />
      </div>
    </div>
  );
};

export default ProjectInfoTab;
