
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProjectFormData } from '@/types/project';
import { FormGrid } from '@/components/form/FormGrid';
import { FormSection } from '@/components/form/FormSection';
import FormRow from '@/components/form/FormRow';

interface TeamRequirementsTabProps {
  formData: ProjectFormData;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string | undefined>;
}

const TeamRequirementsTab: React.FC<TeamRequirementsTabProps> = ({ 
  formData, 
  updateFormData,
  errors
}) => {
  // Helper to handle nested team updates
  const updateTeam = (field: string, value: string) => {
    updateFormData(`team.${field}`, value);
  };

  return (
    <div className="space-y-6">
      <FormSection title="Team Information" description="Define the team members for this project">
        <FormGrid columns={2}>
          <FormRow>
            <Label htmlFor="projectManager" className="text-sm text-zinc-400">
              Project Manager
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="projectManager"
              placeholder="Select project manager"
              value={formData.team?.projectManager || ''}
              onChange={(e) => updateTeam('projectManager', e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
            />
            {errors['team.projectManager'] && <p className="text-xs text-red-500 mt-1">{errors['team.projectManager']}</p>}
          </FormRow>
        </FormGrid>
      </FormSection>

      <FormSection title="Project Requirements" description="Define the requirements for this project">
        <FormGrid columns={1}>
          <FormRow>
            <Label htmlFor="estimatedWindows" className="text-sm text-zinc-400">
              Estimated Number of Windows
            </Label>
            <Input
              id="estimatedWindows"
              type="number"
              placeholder="0"
              value={formData.estimatedWindows || ''}
              onChange={(e) => updateFormData('estimatedWindows', e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
              min={1}
            />
            {errors.estimatedWindows && <p className="text-xs text-red-500 mt-1">{errors.estimatedWindows}</p>}
          </FormRow>

          <FormRow>
            <Label htmlFor="instructions" className="text-sm text-zinc-400">
              Special Instructions
            </Label>
            <Textarea
              id="instructions"
              placeholder="Add any special instructions here"
              value={formData.instructions || ''}
              onChange={(e) => updateFormData('instructions', e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white min-h-[150px]"
            />
          </FormRow>
        </FormGrid>
      </FormSection>
    </div>
  );
};

export default TeamRequirementsTab;
