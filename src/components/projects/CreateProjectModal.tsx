
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectFormData } from '@/types/project';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useProjectForm } from '@/hooks/project-form/useProjectForm';
import ProjectInfoTab from './modal-tabs/ProjectInfoTab';
import LocationTimelineTab from './modal-tabs/LocationTimelineTab';
import TeamRequirementsTab from './modal-tabs/TeamRequirementsTab';
import AttachmentsMetadataTab from './modal-tabs/AttachmentsMetadataTab';

export interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (data: ProjectFormData) => void;
  defaultValues?: Partial<ProjectFormData>;
  submitButtonText?: string;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  onOpenChange,
  onCreateProject,
  defaultValues,
  submitButtonText = "Create Project"
}) => {
  const {
    activeTab,
    setActiveTab,
    formData,
    errors,
    projectId,
    updateFormData,
    handleSubmit,
    draftSaved,
    saveDraft,
  } = useProjectForm({
    onCreateProject,
    onClose: () => onOpenChange(false),
    defaultValues
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden bg-zinc-900 border border-zinc-800 text-white max-w-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold flex justify-between items-center">
            <div>Create New Project</div>
            <Button 
              variant="ghost" 
              size="sm"
              className="w-8 h-8 p-0 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">
            Project ID: {projectId}
          </DialogDescription>
        </DialogHeader>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="border-b border-zinc-800 px-6">
            <TabsList className="bg-transparent h-auto p-0 space-x-6">
              <TabsTrigger 
                value="project-info" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-0 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
              >
                Project Info
              </TabsTrigger>
              <TabsTrigger 
                value="location-timeline" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-0 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
              >
                Location & Timeline
              </TabsTrigger>
              <TabsTrigger 
                value="team-requirements" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-0 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
              >
                Team & Requirements
              </TabsTrigger>
              <TabsTrigger 
                value="attachments-metadata" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-0 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
              >
                Attachments & Metadata
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
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

        <div className="flex justify-between items-center border-t border-zinc-800 p-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={saveDraft}
            >
              Save Draft
            </Button>
            {draftSaved && (
              <span className="text-xs text-green-500">Draft saved</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white" 
              onClick={handleSubmit}
            >
              {submitButtonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
