
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectFormData } from '@/types/project';
import { FormGrid } from '@/components/form/FormGrid';
import { FormSection } from '@/components/form/FormSection';
import FormRow from '@/components/form/FormRow';

interface ProjectInfoTabProps {
  formData: ProjectFormData;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string | undefined>;
}

const ProjectInfoTab: React.FC<ProjectInfoTabProps> = ({ 
  formData, 
  updateFormData,
  errors
}) => {
  return (
    <FormSection title="Project Information" description="Enter the basic information about your project">
      <FormGrid columns={1}>
        <FormRow>
          <Label htmlFor="name" className="text-sm text-zinc-400">
            Project Name
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Enter project name"
            value={formData.name || ''}
            onChange={(e) => updateFormData('name', e.target.value)}
            className="bg-zinc-800/50 border-zinc-700 text-white"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </FormRow>

        <FormRow>
          <Label htmlFor="type" className="text-sm text-zinc-400">
            Project Type
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formData.type || ''} 
            onValueChange={(value) => updateFormData('type', value)}
          >
            <SelectTrigger id="type" className="bg-zinc-800/50 border-zinc-700 text-white">
              <SelectValue placeholder="Select a project type" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
        </FormRow>

        <FormRow>
          <Label htmlFor="description" className="text-sm text-zinc-400">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your project"
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            className="bg-zinc-800/50 border-zinc-700 text-white min-h-[100px]"
          />
        </FormRow>
      </FormGrid>
    </FormSection>
  );
};

export default ProjectInfoTab;
