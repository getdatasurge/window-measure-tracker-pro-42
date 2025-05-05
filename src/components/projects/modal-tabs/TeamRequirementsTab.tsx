
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectFormData } from '../CreateProjectModal';
import { Checkbox } from "@/components/ui/checkbox";

interface TeamRequirementsTabProps {
  formData: ProjectFormData;
  updateFormData: (field: keyof ProjectFormData, value: any) => void;
  errors: Partial<Record<keyof ProjectFormData, string>>;
}

// Mock data for users - in a real app, these would be fetched from an API
const projectManagers = [
  { id: 'pm1', name: 'Jennifer Lee', role: 'Senior Manager' },
  { id: 'pm2', name: 'Michael Wong', role: 'Project Lead' },
  { id: 'pm3', name: 'Sarah Johnson', role: 'Regional Manager' }
];

const managers = [
  { id: 'm1', name: 'Robert Chen', role: 'Assistant Manager' },
  { id: 'm2', name: 'Emily Taylor', role: 'Team Lead' },
  { id: 'm3', name: 'David Wilson', role: 'Operations Manager' }
];

const installers = [
  { id: 'i1', name: 'David Wilson', role: 'Installer', avatar: '/lovable-uploads/7f20168e-3c52-442c-b8bf-36eff9322f5f.png' },
  { id: 'i2', name: 'Lisa Kim', role: 'Installer', avatar: '/lovable-uploads/a7f116da-9522-4007-992c-da874c0ee21b.png' },
  { id: 'i3', name: 'John Smith', role: 'Installer', avatar: '/lovable-uploads/035b20b4-275d-4386-b595-ed558321cd84.png' }
];

const TeamRequirementsTab: React.FC<TeamRequirementsTabProps> = ({ 
  formData, 
  updateFormData,
  errors
}) => {
  
  const handleInstallerToggle = (installerId: string) => {
    const currentInstallers = [...formData.assignedInstallers];
    
    if (currentInstallers.includes(installerId)) {
      updateFormData('assignedInstallers', currentInstallers.filter(id => id !== installerId));
    } else {
      updateFormData('assignedInstallers', [...currentInstallers, installerId]);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Assigned Personnel Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <h3 className="text-sm font-medium text-white">Assigned Personnel</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectManager" className="text-sm text-zinc-400 flex items-center">
              Project Manager <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select 
              value={formData.projectManager} 
              onValueChange={(value) => updateFormData('projectManager', value)}
            >
              <SelectTrigger id="projectManager" className="bg-zinc-800/50 border-zinc-700 text-white">
                <SelectValue placeholder="Select project manager" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {projectManagers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    <div className="flex flex-col">
                      <span>{manager.name}</span>
                      <span className="text-xs text-zinc-400">{manager.role}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.projectManager && (
              <p className="text-xs text-red-500 mt-1">{errors.projectManager}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="manager" className="text-sm text-zinc-400">
              Manager
            </Label>
            <Select 
              value={formData.manager} 
              onValueChange={(value) => updateFormData('manager', value)}
            >
              <SelectTrigger id="manager" className="bg-zinc-800/50 border-zinc-700 text-white">
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    <div className="flex flex-col">
                      <span>{manager.name}</span>
                      <span className="text-xs text-zinc-400">{manager.role}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm text-zinc-400">
            Assigned Installers
          </Label>
          <div className="space-y-2">
            {installers.map((installer) => (
              <div 
                key={installer.id} 
                className="flex items-center justify-between px-4 py-2 rounded-md bg-zinc-800/50 border border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={installer.avatar} alt={installer.name} />
                    <AvatarFallback className="bg-zinc-700 text-zinc-200">
                      {installer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-white">{installer.name}</p>
                    <p className="text-xs text-zinc-400">{installer.role}</p>
                  </div>
                </div>
                <Checkbox
                  id={`installer-${installer.id}`}
                  checked={formData.assignedInstallers.includes(installer.id)}
                  onCheckedChange={() => handleInstallerToggle(installer.id)}
                  className="h-5 w-5 border-zinc-600"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Measurement Requirements Section */}
      <div className="space-y-4 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <h3 className="text-sm font-medium text-white">Measurement Requirements</h3>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="totalEstimatedWindows" className="text-sm text-zinc-400">
            Total Estimated Windows
          </Label>
          <Input
            id="totalEstimatedWindows"
            type="number"
            value={formData.totalEstimatedWindows || ''}
            onChange={(e) => updateFormData('totalEstimatedWindows', parseInt(e.target.value) || 0)}
            className="bg-zinc-800/50 border-zinc-700 text-white"
            placeholder="Enter number of windows"
            min={0}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="specialInstructions" className="text-sm text-zinc-400">
            Special Instructions
          </Label>
          <Textarea
            id="specialInstructions"
            value={formData.specialInstructions}
            onChange={(e) => updateFormData('specialInstructions', e.target.value)}
            className="bg-zinc-800/50 border-zinc-700 text-white min-h-[120px]"
            placeholder="Enter any special instructions or requirements"
          />
        </div>
      </div>
    </div>
  );
};

export default TeamRequirementsTab;
