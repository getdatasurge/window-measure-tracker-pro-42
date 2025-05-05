
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProjectModalContent from './ProjectModalContent';
import { useProjectForm } from '@/hooks/useProjectForm';
import { ProjectFormData } from '@/types/project';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileCheck } from "lucide-react";

export interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (data: ProjectFormData) => void;
  defaultValues?: Partial<ProjectFormData>;
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
  defaultValues 
}) => {
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  
  const {
    activeTab,
    setActiveTab,
    formData,
    errors,
    projectId,
    resetForm,
    updateFormData,
    handleSubmit,
    hasSavedDraft,
    clearSavedDraft
  } = useProjectForm({ 
    onCreateProject, 
    onClose: () => onOpenChange(false),
    defaultValues
  });
  
  // Calculate current step and progress percentage
  const currentStep = tabToStepMap[activeTab as keyof typeof tabToStepMap] || 0;
  const progressPercentage = ((currentStep + 1) / Object.keys(tabToStepMap).length) * 100;
  
  // Check for draft when modal opens
  useEffect(() => {
    if (open) {
      if (hasSavedDraft()) {
        setShowDraftPrompt(true);
      } else {
        resetForm();
      }
    }
  }, [open, hasSavedDraft]);

  const handleResumeDraft = () => {
    resetForm(true); // Pass true to use the saved draft
    setShowDraftPrompt(false);
  };

  const handleDiscardDraft = () => {
    clearSavedDraft();
    resetForm();
    setShowDraftPrompt(false);
  };

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
              {showDraftPrompt ? (
                <div className="p-6 space-y-4">
                  <Alert className="bg-zinc-800 border-zinc-700">
                    <FileCheck className="h-5 w-5 text-green-500" />
                    <AlertTitle className="font-semibold text-white">Saved draft available</AlertTitle>
                    <AlertDescription className="text-zinc-400">
                      Would you like to resume from your previous draft?
                    </AlertDescription>
                  </Alert>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                      onClick={handleDiscardDraft}
                    >
                      Discard Draft
                    </Button>
                    <Button 
                      onClick={handleResumeDraft}
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      Resume Draft
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step Progress Indicator */}
                  <div className="p-4 border-b border-zinc-800 bg-zinc-900/90">
                    <div className="flex items-center justify-between mb-2">
                      {stepLabels.map((label, index) => (
                        <button
                          key={index}
                          className={`text-xs font-medium ${
                            index === currentStep 
                              ? "text-green-500" 
                              : index < currentStep 
                                ? "text-zinc-400"
                                : "text-zinc-600"
                          } transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded px-1`}
                          onClick={() => {
                            // Allow navigation to completed or current steps
                            if (index <= currentStep) {
                              setActiveTab(Object.keys(tabToStepMap)[index]);
                            }
                          }}
                          aria-current={index === currentStep ? "step" : undefined}
                          disabled={index > currentStep}
                        >
                          <span className="hidden sm:inline">{label}</span>
                          <span className="inline sm:hidden">{index + 1}</span>
                        </button>
                      ))}
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className="h-1 bg-zinc-800" 
                      style={{ "--progress-indicator-color": "rgb(34 197 94)" } as React.CSSProperties}
                    />
                  </div>

                  <ProjectModalContent
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    formData={formData}
                    errors={errors}
                    projectId={projectId}
                    updateFormData={updateFormData}
                    handleSubmit={handleSubmit}
                  />
                </>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CreateProjectModal;
