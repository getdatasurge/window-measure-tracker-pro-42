
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProjectModalContent from './ProjectModalContent';
import { useProjectForm } from '@/hooks/useProjectForm';
import { ProjectFormData } from '@/types/project';

export interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (data: ProjectFormData) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ 
  open, 
  onOpenChange,
  onCreateProject 
}) => {
  const {
    activeTab,
    setActiveTab,
    formData,
    errors,
    projectId,
    resetForm,
    updateFormData,
    handleSubmit
  } = useProjectForm({ 
    onCreateProject, 
    onClose: () => onOpenChange(false) 
  });
  
  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 bg-zinc-900 border border-zinc-800 text-white overflow-hidden">
        <ProjectModalContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formData={formData}
          errors={errors}
          projectId={projectId}
          updateFormData={updateFormData}
          handleSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
