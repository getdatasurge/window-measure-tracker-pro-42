
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

// Mock approvers for demo purposes
const approvers = [
  'Sarah Johnson',
  'Robert Chen',
  'John Smith',
  'Emily Davis',
  'Michael Roberts'
];

const StatusWorkflowTab: React.FC<StatusWorkflowTabProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status" className="text-sm text-zinc-400 mb-1 block">
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
        
        <div>
          <Label htmlFor="approvalBy" className="text-sm text-zinc-400 mb-1 block">
            Approval By
          </Label>
          <Input
            id="approvalBy"
            value={formData.approvalBy || ''}
            onChange={(e) => updateFormData('approvalBy', e.target.value)}
            className="bg-zinc-800/50 border-zinc-700 text-white"
            list="approversList"
          />
          <datalist id="approversList">
            {approvers.map(approver => (
              <option key={approver} value={approver} />
            ))}
          </datalist>
        </div>
      </div>
      
      <div>
        <Label htmlFor="approvalDate" className="text-sm text-zinc-400 mb-1 block">
          Approval Date
        </Label>
        <Input
          id="approvalDate"
          type="date"
          value={formData.approvalDate || ''}
          onChange={(e) => updateFormData('approvalDate', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white"
        />
      </div>
      
      <div>
        <Label htmlFor="reviewComments" className="text-sm text-zinc-400 mb-1 block">
          Review Comments
        </Label>
        <Textarea
          id="reviewComments"
          value={formData.reviewComments || ''}
          onChange={(e) => updateFormData('reviewComments', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white min-h-[150px]"
          placeholder="Enter review comments or approval notes..."
        />
      </div>
    </div>
  );
};

export default StatusWorkflowTab;
