
// I'll modify the component to not access the non-existent projectManager property
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProjectFormData } from '@/types/project';

interface TeamRequirementsTabProps {
  formData: ProjectFormData;
  updateFormData: (field: string, value: any) => void;
  errors: Partial<Record<string, string>>;
}

const TeamRequirementsTab: React.FC<TeamRequirementsTabProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Team Information</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="team-lead" className="text-sm">Team Lead</Label>
            <Input
              id="team-lead"
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Select or enter team lead"
              value={(formData.team?.members.find(m => m.role === 'lead')?.id || '')}
              onChange={(e) => {
                const members = [...(formData.team?.members || [])];
                const leadIndex = members.findIndex(m => m.role === 'lead');
                
                if (leadIndex >= 0) {
                  // Update existing
                  members[leadIndex] = { ...members[leadIndex], id: e.target.value };
                } else {
                  // Add new
                  members.push({ id: e.target.value, role: 'lead' });
                }
                
                updateFormData('team.members', members);
              }}
            />
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Project Requirements</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="estimatedWindows" className="text-sm">Estimated Number of Windows</Label>
            <Input
              id="estimatedWindows"
              type="number"
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter estimated number of windows"
              value={formData.estimatedWindows || ''}
              onChange={(e) => updateFormData('estimatedWindows', e.target.value ? parseInt(e.target.value) : null)}
            />
          </div>
          
          <div>
            <Label htmlFor="instructions" className="text-sm">Special Instructions</Label>
            <Textarea
              id="instructions"
              className="bg-zinc-800 border-zinc-700 text-white min-h-[120px]"
              placeholder="Enter any special instructions or requirements"
              value={formData.instructions || ''}
              onChange={(e) => updateFormData('instructions', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamRequirementsTab;
