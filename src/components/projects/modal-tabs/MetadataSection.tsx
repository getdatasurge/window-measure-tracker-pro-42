
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import TagsInput from './TagsInput';
import { ProjectFormData } from '@/types/project';

interface MetadataSectionProps {
  formData: ProjectFormData;
  updateFormData: (field: string, value: any) => void;
}

const priorityOptions: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High'];

const MetadataSection: React.FC<MetadataSectionProps> = ({ 
  formData, 
  updateFormData 
}) => {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-4 rounded-full bg-green-500"></div>
        <h3 className="text-sm font-medium text-white">Additional Metadata</h3>
      </div>
      
      <div className="space-y-4">
        <TagsInput 
          tags={formData.tags || []} 
          onTagsChange={(tags) => updateFormData('tags', tags)} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm text-zinc-400">
              Priority Level
            </Label>
            <Select 
              value={formData.priority || 'Medium'} 
              onValueChange={(value: 'Low' | 'Medium' | 'High') => updateFormData('priority', value)}
            >
              <SelectTrigger id="priority" className="bg-zinc-800/50 border-zinc-700 text-white">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {priorityOptions.map((priority) => (
                  <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budgetEstimate" className="text-sm text-zinc-400">
              Budget Estimate ($)
            </Label>
            <Input
              id="budgetEstimate"
              type="number"
              value={formData.budgetEstimate || 0}
              onChange={(e) => updateFormData('budgetEstimate', parseFloat(e.target.value) || 0)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
              placeholder="Enter budget amount"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetadataSection;
