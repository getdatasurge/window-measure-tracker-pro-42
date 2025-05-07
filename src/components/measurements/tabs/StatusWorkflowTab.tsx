
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Measurement, MeasurementStatus } from '@/types/measurement';
import { cn } from '@/lib/utils';

interface StatusWorkflowTabProps {
  formData: Measurement;
  updateFormData: (field: string, value: any) => void;
}

const StatusWorkflowTab: React.FC<StatusWorkflowTabProps> = ({ formData, updateFormData }) => {
  // Status options with styling
  const statusOptions: { value: MeasurementStatus; label: string; className: string }[] = [
    { value: 'Pending', label: 'Pending', className: 'text-yellow-500' },
    { value: 'Film_Cut', label: 'Film Cut', className: 'text-blue-500' },
    { value: 'Installed', label: 'Installed', className: 'text-green-500' },
    { value: 'Completed', label: 'Completed', className: 'text-purple-500' }
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm text-zinc-400">
          Status
        </Label>
        <Select
          value={formData.status}
          onValueChange={(value) => updateFormData('status', value)}
        >
          <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            {statusOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className={cn("text-white", option.className)}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reviewComments" className="text-sm text-zinc-400">
          Entry Comments
        </Label>
        <Textarea
          id="reviewComments"
          value={formData.reviewComments || ''}
          onChange={(e) => updateFormData('reviewComments', e.target.value)}
          placeholder="Add any workflow comments or notes here..."
          className="h-24 bg-zinc-800/50 border-zinc-700 text-white"
        />
      </div>
    </div>
  );
};

export default StatusWorkflowTab;
