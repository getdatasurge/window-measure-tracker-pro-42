
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Measurement, MeasurementStatus } from '@/data/measurementsData';

interface StatusWorkflowTabProps {
  formData: Measurement;
  updateFormData: (field: string, value: any) => void;
}

const statuses: MeasurementStatus[] = [
  'Pending',
  'Film Cut',
  'Installed',
  'Under Review',
  'Completed'
];

const StatusWorkflowTab: React.FC<StatusWorkflowTabProps> = ({ 
  formData, 
  updateFormData 
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm text-zinc-400">
          Status
        </Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => updateFormData('status', value)}
        >
          <SelectTrigger id="status" className="bg-zinc-800/50 border-zinc-700 text-white">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reviewComments" className="text-sm text-zinc-400">
          Review Comments
        </Label>
        <Textarea
          id="reviewComments"
          value={formData.reviewComments || ''}
          onChange={(e) => updateFormData('reviewComments', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white min-h-[150px]"
          placeholder="Enter review comments or general notes..."
        />
      </div>
    </div>
  );
};

export default StatusWorkflowTab;
