
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ProjectModalContent from './ProjectModalContent';
import { useProjectForm } from '@/hooks/useProjectForm';
import { ProjectFormData } from '@/types/project';
import { motion, AnimatePresence } from 'framer-motion';
import StepProgressIndicator from './StepProgressIndicator';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';

export interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (data: ProjectFormData) => void;
  defaultValues?: Partial<ProjectFormData>;
  submitButtonText?: string;
}

// Map tab names to step indices
const tabToStepMap = {
  'project-info': 0,
  'location-timeline': 1,
  'team-requirements': 2,
  'attachments-metadata': 3,
};

const stepLabels = ['Project Info', 'Location & Timeline', 'Team & Requirements', 'Attachments & Metadata'];

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
    resetForm,
    updateFormData,
    handleSubmit,
  } = useProjectForm({ 
    onCreateProject, 
    onClose: () => {
      onOpenChange(false);
    },
    defaultValues
  });
  
  // Calculate current step
  const currentStep = tabToStepMap[activeTab as keyof typeof tabToStepMap] || 0;
  
  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, resetForm]);
  
  const handleStepClick = (stepIndex: number) => {
    // Convert step index back to tab name
    const tabNames = Object.keys(tabToStepMap);
    setActiveTab(tabNames[stepIndex]);
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl p-0 bg-zinc-900 border border-zinc-800 text-white overflow-hidden">
            {/* Hidden dialog title and description for accessibility */}
            <DialogTitle className="sr-only">Create New Project</DialogTitle>
            <DialogDescription className="sr-only">
              Fill in the project details to create a new project.
            </DialogDescription>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full"
            >
              <ModalHeader projectId={projectId} />
              
              {/* Step Progress Indicator */}
              <StepProgressIndicator 
                currentStep={currentStep}
                totalSteps={Object.keys(tabToStepMap).length}
                stepLabels={stepLabels}
                onStepClick={handleStepClick}
              />

              <ProjectModalContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                formData={formData}
                errors={errors}
                projectId={projectId}
                updateFormData={updateFormData}
                handleSubmit={handleSubmit}
              />

              <ModalFooter 
                onSubmit={handleSubmit}
                submitButtonText={submitButtonText}
                showSaveDraft={false}
              />
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CreateProjectModal;
