
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ProjectModalContent from './ProjectModalContent';
import { useProjectForm } from '@/hooks/project-form/useProjectForm';
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
    draftSaved,
    saveDraft,
  } = useProjectForm({ 
    onCreateProject, 
    onClose: () => {
      onOpenChange(false);
    },
    defaultValues
  });
  
  // Calculate current step
  const currentStep = tabToStepMap[activeTab as keyof typeof tabToStepMap] || 0;
  
  // Convert errors to step errors format
  const stepErrors: Record<number, boolean> = {
    0: false,
    1: false,
    2: false,
    3: false
  };
  
  // Check if there are any errors in each step
  if (Object.keys(errors).length > 0) {
    // Project Info step
    if (errors.name || errors.type || errors.description) {
      stepErrors[0] = true;
    }
    
    // Location & Timeline step
    if (errors.location || errors.timeline) {
      stepErrors[1] = true;
    }
    
    // Team & Requirements step
    if (errors.team || errors.estimatedWindows || errors.instructions) {
      stepErrors[2] = true;
    }
    
    // Metadata step
    if (errors.tags || errors.priority || errors.budgetEstimate || errors.attachments) {
      stepErrors[3] = true;
    }
  }
  
  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      console.log("Modal opened, resetting form");
      resetForm();
    }
  }, [open, resetForm]);
  
  const handleStepClick = (stepIndex: number) => {
    // Convert step index back to tab name
    const tabNames = Object.keys(tabToStepMap);
    setActiveTab(tabNames[stepIndex]);
  };

  // Add completedSteps array (initialize as empty for now)
  // In a real implementation, you would track completed steps based on form validity
  const completedSteps: number[] = [];

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl p-0 max-h-[90vh] bg-zinc-900 border border-zinc-800 text-white flex flex-col">
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
              className="w-full flex flex-col h-full"
            >
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 bg-zinc-900">
                <ModalHeader projectId={projectId} />
                
                {/* Step Progress Indicator */}
                <StepProgressIndicator 
                  currentStep={currentStep}
                  totalSteps={Object.keys(tabToStepMap).length}
                  stepLabels={stepLabels}
                  onStepClick={handleStepClick}
                  stepErrors={stepErrors}
                  completedSteps={completedSteps}
                />
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto">
                <ProjectModalContent
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  formData={formData}
                  errors={errors}
                  projectId={projectId}
                  updateFormData={updateFormData}
                  handleSubmit={handleSubmit}
                />
              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 z-10">
                <ModalFooter 
                  onSubmit={handleSubmit}
                  submitButtonText={submitButtonText}
                  currentStep={currentStep}
                  totalSteps={Object.keys(tabToStepMap).length}
                  onNextStep={() => {
                    const tabNames = Object.keys(tabToStepMap);
                    const nextStepIndex = currentStep + 1;
                    if (nextStepIndex < tabNames.length) {
                      setActiveTab(tabNames[nextStepIndex]);
                    }
                  }}
                  onPrevStep={() => {
                    const tabNames = Object.keys(tabToStepMap);
                    const prevStepIndex = currentStep - 1;
                    if (prevStepIndex >= 0) {
                      setActiveTab(tabNames[prevStepIndex]);
                    }
                  }}
                  isLastStep={currentStep === Object.keys(tabToStepMap).length - 1}
                  showSaveDraft={true}
                  onSaveDraft={saveDraft}
                  draftSaved={draftSaved}
                />
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CreateProjectModal;
