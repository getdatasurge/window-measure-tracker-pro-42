
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import FormSection from './FormSection';
import FormGrid from './FormGrid';
import FormRow from './FormRow';
import FieldRenderer from './FieldRenderer';
import { Label } from '@/components/ui/label';
import { StepSchema, FieldSchema } from './types';
import StepProgressIndicator from '../projects/StepProgressIndicator';

interface MultiStepFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  steps: StepSchema[];
  defaultValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  submitButtonText?: string; // Added this prop to fix the error
}

const MultiStepFormModal: React.FC<MultiStepFormModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  steps,
  defaultValues = {},
  onSubmit,
  submitButtonText = "Submit" // Default value
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({});
  
  const form = useForm({
    defaultValues,
  });

  const { handleSubmit, formState, trigger, getValues } = form;
  
  const isLastStep = currentStep === steps.length - 1;
  const stepLabels = steps.map(step => step.title);
  
  const handleNext = async () => {
    // Get all field names for the current step
    const currentStepFields = steps[currentStep].fields.map(field => field.name);
    
    // Validate only the fields in the current step
    const isValid = await trigger(currentStepFields as any);
    
    if (isValid) {
      // Mark step as completed and move to next step
      setCompletedSteps(prev => 
        prev.includes(currentStep) ? prev : [...prev, currentStep]
      );
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      // Mark step as having errors
      setStepErrors(prev => ({ ...prev, [currentStep]: true }));
    }
  };
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= Math.max(...completedSteps, 0)) {
      setCurrentStep(stepIndex);
    }
  };
  
  const processSubmit = (data: Record<string, any>) => {
    onSubmit(data);
    onClose();
    // Reset form state
    setCurrentStep(0);
    setCompletedSteps([]);
    setStepErrors({});
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>{title}</DialogTitle>
          {description && <p className="text-sm text-gray-500">{description}</p>}
          
          <StepProgressIndicator 
            currentStep={currentStep}
            totalSteps={steps.length}
            stepLabels={stepLabels}
            onStepClick={handleStepClick}
            stepErrors={stepErrors}
            completedSteps={completedSteps}
          />
        </DialogHeader>
        
        <div className="overflow-y-auto p-6" style={{ maxHeight: '80vh' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <FormSection title={steps[currentStep].title} description={steps[currentStep].description}>
                <FormGrid columns={steps[currentStep].columns || 2}>
                  {steps[currentStep].fields.map(field => (
                    <FormRow key={field.name}>
                      <Label>{field.label}</Label>
                      {/* This line needed to be fixed - FieldRenderer expects field and form */}
                      <FieldRenderer field={field} form={form} />
                    </FormRow>
                  ))}
                </FormGrid>
              </FormSection>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <DialogFooter className="p-6 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack} type="button">
              Back
            </Button>
          )}
          
          {!isLastStep ? (
            <Button onClick={handleNext} type="button">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit(processSubmit)} type="submit">
              {submitButtonText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MultiStepFormModal;
