
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
import { ProjectFormData } from '@/types/project';

interface TeamRequirementsTabProps {
  formData: ProjectFormData;
  updateFormData: (field: string, value: any) => void;
  errors: Partial<Record<string, string>>;
}

// Mock project managers for dropdown
const projectManagers = [
  'Sarah Johnson',
  'Michael Chen',
  'Emily Rodriguez',
  'David Kim',
  'Jessica Patel',
  'Chris Taylor'
];

// Mock installers for multi-select
const availableInstallers = [
  'Jason Martinez',
  'Kevin Smith',
  'Aisha Williams',
  'Robert Lee',
  'Sophia Garcia',
  'Marcus Johnson',
  'James Wilson',
  'Tyler Nguyen',
  'Olivia Brown'
];

const TeamRequirementsTab: React.FC<TeamRequirementsTabProps> = ({ 
  formData, 
  updateFormData,
  errors
}) => {
  const handleAddInstaller = (installer: string) => {
    if (!formData.team?.installers?.includes(installer)) {
      updateFormData('team.installers', [...(formData.team?.installers || []), installer]);
    }
  };
  
  const handleRemoveInstaller = (installer: string) => {
    updateFormData('team.installers', formData.team?.installers?.filter(i => i !== installer) || []);
  };
  
  return (
    <div className="space-y-6">
      {/* Project Team Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <h3 className="text-sm font-medium text-white">Project Team</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectManager" className="text-sm text-zinc-400 flex items-center">
              Project Manager <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select 
              value={formData.team?.projectManager || ''} 
              onValueChange={(value) => updateFormData('team.projectManager', value)}
            >
              <SelectTrigger id="projectManager" className="bg-zinc-800/50 border-zinc-700 text-white">
                <SelectValue placeholder="Select project manager" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {projectManagers.map((manager) => (
                  <SelectItem key={manager} value={manager}>{manager}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors['team.projectManager'] && (
              <p className="text-xs text-red-500 mt-1">{errors['team.projectManager']}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-zinc-400">
              Assigned Installers
            </Label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {formData.team?.installers?.map((installer) => (
                <div 
                  key={installer}
                  className="flex items-center justify-between bg-zinc-800/50 px-3 py-1.5 rounded-md"
                >
                  <span className="text-sm text-zinc-300">{installer}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInstaller(installer)}
                    className="text-zinc-500 hover:text-zinc-300"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <Select 
              value="" 
              onValueChange={handleAddInstaller}
            >
              <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                <SelectValue placeholder="Add installer" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {availableInstallers
                  .filter(installer => !formData.team?.installers?.includes(installer))
                  .map((installer) => (
                    <SelectItem key={installer} value={installer}>{installer}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Project Requirements Section */}
      <div className="space-y-4 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <h3 className="text-sm font-medium text-white">Project Requirements</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="estimatedWindows" className="text-sm text-zinc-400">
              Total Estimated Windows
            </Label>
            <Input
              id="estimatedWindows"
              type="number"
              value={formData.estimatedWindows || 0}
              onChange={(e) => updateFormData('estimatedWindows', parseInt(e.target.value) || 0)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-sm text-zinc-400">
              Special Instructions
            </Label>
            <Textarea
              id="instructions"
              value={formData.instructions || ''}
              onChange={(e) => updateFormData('instructions', e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white min-h-[120px]"
              placeholder="Enter any special instructions or requirements for the project"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamRequirementsTab;
