
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectFormValues, projectSchema } from './validation-schema';
import { defaultValues } from './default-values';
import { notify } from '@/utils/toast-utils';
import { ProjectFormData } from '@/types/project';

interface UseProjectModalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (data: ProjectFormData) => void;
}

export function useProjectModalForm({ 
  open, 
  onOpenChange, 
  onCreateProject 
}: UseProjectModalFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectId] = useState(() => `proj_${Math.random().toString(36).substring(2, 11)}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
  });
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
    mode: 'onChange'
  });

  const {
    handleSubmit,
    trigger,
    reset,
    watch,
    formState: { errors, touchedFields, isValid }
  } = form;

  // Reset form when modal is opened
  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setCurrentStep(0);
      setStepErrors({
        0: false,
        1: false,
        2: false,
        3: false
      });
      setCompletedSteps([]);
    }
  }, [open, reset]);

  // Update step errors based on validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const newStepErrors = { ...stepErrors };
      
      // Project info step
      newStepErrors[0] = !!(errors.name || errors.type || errors.description);
      
      // Location & Timeline step
      newStepErrors[1] = !!(
        errors.location || 
        errors.timeline
      );
      
      // Team & Requirements step
      newStepErrors[2] = !!(
        errors.team || 
        errors.estimatedWindows || 
        errors.instructions
      );
      
      // Metadata step
      newStepErrors[3] = !!(
        errors.tags || 
        errors.priority || 
        errors.budgetEstimate || 
        errors.attachments
      );
      
      setStepErrors(newStepErrors);
    }
  }, [errors]);

  // Watch form values to update completed steps
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      validateCurrentStep();
    });
    return () => subscription.unsubscribe();
  }, [watch, currentStep]);

  const validateCurrentStep = async () => {
    let fieldsToValidate: string[] = [];
    
    switch (currentStep) {
      case 0:
        fieldsToValidate = ['name', 'type', 'description'];
        break;
      case 1:
        fieldsToValidate = [
          'location.addressLine1', 
          'location.city', 
          'location.state', 
          'location.zip',
          'timeline.startDate'
        ];
        break;
      case 2:
        fieldsToValidate = [
          'team.projectManager',
          'estimatedWindows', 
          'instructions'
        ];
        break;
      case 3:
        fieldsToValidate = ['priority', 'budgetEstimate', 'tags'];
        break;
    }
    
    const isValid = await trigger(fieldsToValidate as any);
    
    if (isValid) {
      setCompletedSteps(prev => {
        if (!prev.includes(currentStep)) {
          return [...prev, currentStep].sort((a, b) => a - b);
        }
        return prev;
      });
    } else {
      setCompletedSteps(prev => prev.filter(step => step !== currentStep));
    }
    
    return isValid;
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      if (onCreateProject) {
        onCreateProject(data as unknown as ProjectFormData);
      }
      
      notify.success(`Project ${data.name} has been created successfully`);
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating project:", error);
      notify.error("An error occurred while creating the project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      notify.warning("Please fix the validation errors before proceeding");
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleStepClick = (step: number) => {
    // Only allow clicking on previous steps, current step, or completed steps
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  return {
    form,
    currentStep,
    projectId,
    stepErrors,
    completedSteps,
    isSubmitting,
    handleSubmit: handleSubmit(onSubmit),
    handleNextStep,
    handlePrevStep,
    handleStepClick
  };
}
