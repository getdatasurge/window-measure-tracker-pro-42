
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { StepSchema, FieldSchema } from './types';
import StepProgressIndicator from '../projects/StepProgressIndicator';
import FormSection from './FormSection';
import FormGrid from './FormGrid';
import FormRow from './FormRow';
import FieldRenderer from './FieldRenderer';
import { notify } from '@/utils/toast-utils';

export interface MultiStepFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  steps: StepSchema[];
  defaultValues?: object;
  onSubmit: (data: object) => void;
  submitButtonText?: string;
}

const MultiStepFormModal: React.FC<MultiStepFormModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  steps,
  defaultValues = {},
  onSubmit,
  submitButtonText = "Submit"
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [direction, setDirection] = useState(0);
  
  const form = useForm({
    defaultValues,
    mode: 'onChange'
  });
  
  const { handleSubmit, reset, trigger, formState: { errors, isSubmitting } } = form;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setStepErrors({});
      setCompletedSteps([]);
      reset(defaultValues);
    }
  }, [isOpen, reset, defaultValues]);

  // Get field names for the current step
  const getFieldsForStep = (stepIndex: number): string[] => {
    return steps[stepIndex]?.fields.map(field => field.name) || [];
  };

  // Check if current step has validation errors
  const validateCurrentStep = async (): Promise<boolean> => {
    const stepFields = getFieldsForStep(currentStep);
    const isValid = await trigger(stepFields);
    
    // Update step errors state
    setStepErrors(prev => ({
      ...prev,
      [currentStep]: !isValid
    }));
    
    return isValid;
  };

  // Update direction for animations
  useEffect(() => {
    setDirection(currentStep > direction ? 1 : -1);
  }, [currentStep]);

  // Handle next step or submit
  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Final step, submit the form
        form.handleSubmit((data) => {
          onSubmit(data);
          onClose();
          notify.success("Form submitted successfully!");
        })();
      }
    } else {
      notify.error("Please fix errors before proceeding");
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle manual step click (navigation)
  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < currentStep || completedSteps.includes(stepIndex)) {
      setCurrentStep(stepIndex);
    } else {
      // Only allow if all previous steps are valid
      const canNavigate = Array.from({ length: stepIndex }, (_, i) => i)
        .every(step => completedSteps.includes(step));
        
      if (canNavigate) {
        setCurrentStep(stepIndex);
      } else {
        notify.info("Please complete previous steps first");
      }
    }
  };

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 max-h-[90vh] bg-zinc-900 border border-zinc-800 text-white flex flex-col">
        {/* Hidden dialog title and description for accessibility */}
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          {description || "Fill in the required information"}
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
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
            </div>
            
            {/* Step Progress Indicator */}
            <StepProgressIndicator 
              currentStep={currentStep}
              totalSteps={steps.length}
              stepLabels={steps.map(step => step.title)}
              onStepClick={handleStepClick}
              stepErrors={stepErrors}
              completedSteps={completedSteps}
            />
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <FormProvider {...form}>
              <form id="multi-step-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={`step-${currentStep}`}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25 }}
                    >
                      {steps[currentStep] && (
                        <FormSection 
                          title={steps[currentStep].title} 
                          description={steps[currentStep].description}
                        >
                          <FormGrid columns={steps[currentStep].columns || 2}>
                            {steps[currentStep].fields.map(field => (
                              <FormRow key={field.name}>
                                <FieldRenderer field={field} />
                              </FormRow>
                            ))}
                          </FormGrid>
                        </FormSection>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </form>
            </FormProvider>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 z-10 bg-zinc-900 border-t border-zinc-800 p-6">
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button 
                    variant="secondary" 
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                )}
                
                <Button 
                  variant="default" 
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                >
                  {currentStep === steps.length - 1 ? submitButtonText : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiStepFormModal;
