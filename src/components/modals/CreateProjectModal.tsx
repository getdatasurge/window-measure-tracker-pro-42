
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { ProjectFormData } from '@/types/project';
import ModalHeader from '../projects/ModalHeader';
import ModalFooter from '../projects/ModalFooter';
import ProjectModalFormContent from './project-form/ProjectModalFormContent';
import { useProjectModalForm } from './project-form/use-project-modal-form';
import { STEP_LABELS } from './project-form/constants';

export interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (data: ProjectFormData) => void;
  submitButtonText?: string;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  onOpenChange,
  onCreateProject,
  submitButtonText = "Create Project"
}) => {
  const {
    form,
    currentStep,
    projectId,
    stepErrors,
    isSubmitting,
    handleSubmit,
    handleNextStep,
    handlePrevStep,
    handleStepClick
  } = useProjectModalForm({ open, onOpenChange, onCreateProject });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 bg-zinc-900 border border-zinc-800 text-white overflow-hidden">
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
          className="w-full flex flex-col"
        >
          <ModalHeader projectId={projectId} />
          
          <ProjectModalFormContent 
            form={form}
            currentStep={currentStep}
            projectId={projectId}
            stepErrors={stepErrors}
            handleStepClick={handleStepClick}
          />

          <ModalFooter 
            onSubmit={handleSubmit}
            submitButtonText={submitButtonText}
            currentStep={currentStep}
            totalSteps={STEP_LABELS.length}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            isLastStep={currentStep === STEP_LABELS.length - 1}
            isSubmitting={isSubmitting}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
