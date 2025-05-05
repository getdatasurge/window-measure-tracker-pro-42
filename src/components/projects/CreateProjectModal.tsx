
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProjectModalContent from './ProjectModalContent';
import { useProjectForm } from '@/hooks/useProjectForm';
import { ProjectFormData } from '@/types/project';
import { motion, AnimatePresence } from 'framer-motion';

export interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (data: ProjectFormData) => void;
  defaultValues?: Partial<ProjectFormData>;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ 
  open, 
  onOpenChange,
  onCreateProject,
  defaultValues 
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
    onClose: () => onOpenChange(false),
    defaultValues
  });
  
  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl p-0 bg-zinc-900 border border-zinc-800 text-white overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full"
            >
              <ProjectModalContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                formData={formData}
                errors={errors}
                projectId={projectId}
                updateFormData={updateFormData}
                handleSubmit={handleSubmit}
              />
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CreateProjectModal;
