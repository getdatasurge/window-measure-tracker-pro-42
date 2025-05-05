
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, Folder, MapPin, Users, File } from "lucide-react";
import ProjectInfoTab from './modal-tabs/ProjectInfoTab';
import LocationTimelineTab from './modal-tabs/LocationTimelineTab';
import TeamRequirementsTab from './modal-tabs/TeamRequirementsTab';
import AttachmentsMetadataTab from './modal-tabs/AttachmentsMetadataTab';
import { toast } from '@/hooks/use-toast';
import { ProjectFormData } from '@/types/project';

export interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (data: ProjectFormData) => void;
}

const defaultFormData: ProjectFormData = {
  name: '',
  type: '',
  status: 'Planned',
  description: '',
  
  location: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
  },
  
  timeline: {
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    completionDate: '',
  },
  
  team: {
    projectManager: '',
    installers: [],
  },
  estimatedWindows: 0,
  instructions: '',
  
  attachments: {
    blueprints: [],
    photos: [],
    contracts: [],
  },
  tags: [],
  priority: 'Medium',
  budgetEstimate: 0,
};

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ 
  open, 
  onOpenChange,
  onCreateProject 
}) => {
  const [activeTab, setActiveTab] = useState('project-info');
  const [formData, setFormData] = useState<ProjectFormData>(defaultFormData);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  
  // Generate a random project ID for display
  const projectId = `PRJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData(defaultFormData);
      setErrors({});
      setActiveTab('project-info');
    }
  }, [open]);
  
  const updateFormData = (field: string, value: any) => {
    // Handle nested properties
    const fieldParts = field.split('.');
    
    if (fieldParts.length === 1) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      // Handle nested fields (e.g., 'location.addressLine1')
      const [parent, child] = fieldParts;
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProjectFormData],
          [child]: value
        }
      }));
    }
    
    // Clear error when user updates a field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};
    
    // Required fields validation
    if (!formData.name) newErrors['name'] = 'Project name is required';
    if (!formData.type) newErrors['type'] = 'Project type is required';
    if (!formData.location?.addressLine1) newErrors['location.addressLine1'] = 'Address is required';
    if (!formData.location?.city) newErrors['location.city'] = 'City is required';
    if (!formData.location?.state) newErrors['location.state'] = 'State is required';
    if (!formData.location?.zip) newErrors['location.zip'] = 'ZIP code is required';
    if (!formData.timeline?.startDate) newErrors['timeline.startDate'] = 'Start date is required';
    if (!formData.team?.projectManager) newErrors['team.projectManager'] = 'Project manager is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // Call the onCreateProject callback with the form data
      onCreateProject?.(formData);
      
      // Close modal and show success message
      onOpenChange(false);
      toast({
        title: "Project Created",
        description: `${formData.name} has been successfully created.`,
      });
    } else {
      // Show error message for validation failures
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      
      // Navigate to the first tab with errors
      if (errors.name || errors.type) {
        setActiveTab('project-info');
      } else if (errors['location.addressLine1'] || errors['location.city'] || 
                errors['location.state'] || errors['location.zip'] || 
                errors['timeline.startDate']) {
        setActiveTab('location-timeline');
      } else if (errors['team.projectManager']) {
        setActiveTab('team-requirements');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 bg-zinc-900 border border-zinc-800 text-white overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-green-500" />
            <div>
              <h2 className="text-lg font-semibold">Create New Project</h2>
              <p className="text-sm text-zinc-400">ID: {projectId} | Fill in the project details below</p>
            </div>
          </div>
          <DialogClose className="p-1 rounded-md hover:bg-zinc-800">
            <X className="h-4 w-4" />
          </DialogClose>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-zinc-800">
            <TabsList className="bg-transparent h-auto p-0">
              <TabsTrigger 
                value="project-info" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-6 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
              >
                Project Info
              </TabsTrigger>
              <TabsTrigger 
                value="location-timeline" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-6 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
              >
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Location & Timeline</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="team-requirements" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-6 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
              >
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Team & Requirements</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="attachments-metadata" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-6 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
              >
                <div className="flex items-center gap-1">
                  <File className="h-4 w-4" />
                  <span>Attachments & Metadata</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="project-info" className="m-0">
              <ProjectInfoTab 
                formData={formData} 
                updateFormData={updateFormData} 
                errors={errors}
              />
            </TabsContent>
            
            <TabsContent value="location-timeline" className="m-0">
              <LocationTimelineTab 
                formData={formData} 
                updateFormData={updateFormData} 
                errors={errors}
              />
            </TabsContent>
            
            <TabsContent value="team-requirements" className="m-0">
              <TeamRequirementsTab 
                formData={formData} 
                updateFormData={updateFormData} 
                errors={errors}
              />
            </TabsContent>
            
            <TabsContent value="attachments-metadata" className="m-0">
              <AttachmentsMetadataTab 
                formData={formData} 
                updateFormData={updateFormData} 
                errors={errors}
              />
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="flex justify-between p-6 border-t border-zinc-800 bg-zinc-900/80">
          <p className="text-xs text-zinc-500">* Required fields</p>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleSubmit}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Create Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
