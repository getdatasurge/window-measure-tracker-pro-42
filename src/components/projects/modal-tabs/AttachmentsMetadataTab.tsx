
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectFormData } from '@/types/project';
import { FormGrid } from '@/components/form/FormGrid';
import { FormSection } from '@/components/form/FormSection';
import FormRow from '@/components/form/FormRow';

interface AttachmentsMetadataTabProps {
  formData: ProjectFormData;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string | undefined>;
}

const AttachmentsMetadataTab: React.FC<AttachmentsMetadataTabProps> = ({ 
  formData, 
  updateFormData,
  errors
}) => {
  return (
    <div className="space-y-6">
      <FormSection title="Project Metadata" description="Add additional metadata to your project">
        <FormGrid columns={2}>
          <FormRow>
            <Label htmlFor="priority" className="text-sm text-zinc-400">
              Priority
            </Label>
            <Select 
              value={formData.priority || 'Medium'} 
              onValueChange={(value) => updateFormData('priority', value)}
            >
              <SelectTrigger id="priority" className="bg-zinc-800/50 border-zinc-700 text-white">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </FormRow>

          <FormRow>
            <Label htmlFor="budgetEstimate" className="text-sm text-zinc-400">
              Budget Estimate
            </Label>
            <Input
              id="budgetEstimate"
              type="number"
              placeholder="$ 0.00"
              value={formData.budgetEstimate || ''}
              onChange={(e) => updateFormData('budgetEstimate', e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
            />
          </FormRow>
        </FormGrid>
      </FormSection>

      <FormSection title="File Attachments" description="Upload relevant files for this project">
        <div className="bg-zinc-800/50 border border-dashed border-zinc-700 rounded-md p-6 text-center">
          <p className="text-zinc-400">
            Drag and drop files here, or click to browse
          </p>
          <Input
            type="file"
            className="hidden"
            onChange={() => {/* Functionality to be implemented */}}
          />
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-md text-sm font-medium text-white transition-colors"
          >
            Browse Files
          </button>
        </div>
      </FormSection>
    </div>
  );
};

export default AttachmentsMetadataTab;
