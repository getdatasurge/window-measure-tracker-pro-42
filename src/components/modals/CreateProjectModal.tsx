
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import ModalFooter from '../projects/ModalFooter';
import { ProjectFormData } from '@/types/project';
import StepProgressIndicator from '../projects/StepProgressIndicator';
import ProjectInfoStep from './steps/ProjectInfoStep';
import LocationTimelineStep from './steps/LocationTimelineStep';
import TeamRequirementsStep from './steps/TeamRequirementsStep';
import MetadataStep from './steps/MetadataStep';
import ModalHeader from '../projects/ModalHeader';
import { toast } from '@/hooks/use-toast';

// Define validation schema for the form
const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  type: z.string().min(1, "Project type is required"),
  description: z.string().optional(),
  location: z.object({
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
  }).optional(),
  timeline: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    completionDate: z.string().optional(),
  }),
  team: z.object({
    projectManager: z.string().optional(),
    installers: z.array(z.string()).optional(),
  }),
  estimatedWindows: z.number().optional(),
  instructions: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  budgetEstimate: z.number().optional(),
  attachments: z.object({
    blueprints: z.array(z.any()).optional(),
    photos: z.array(z.any()).optional(),
    contracts: z.array(z.any()).optional(),
  }).optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

const defaultValues: ProjectFormValues = {
  name: '',
  type: '',
  description: '',
  location: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
  },
  timeline: {
    startDate: '',
    endDate: '',
    completionDate: '',
  },
  team: {
    projectManager: '',
    installers: [],
  },
  estimatedWindows: 0,
  instructions: '',
  tags: [],
  priority: 'Medium',
  budgetEstimate: 0,
  attachments: {
    blueprints: [],
    photos: [],
    contracts: [],
  },
};

const STEP_LABELS = ['Project Info', 'Location & Timeline', 'Team & Requirements', 'Metadata'];

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
  const [currentStep, setCurrentStep] = useState(0);
  const [projectId] = useState(() => `proj_${Math.random().toString(36).substring(2, 11)}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
    mode: 'onSubmit'
  });

  const {
    handleSubmit,
    trigger,
    reset,
    formState: { errors }
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

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      if (onCreateProject) {
        onCreateProject(data as unknown as ProjectFormData);
      }
      
      toast({
        title: "Project created successfully",
        description: `Project ${data.name} has been created.`
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: "An error occurred while creating the project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    // Use fields to validate based on current step
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
    
    if (isValid && currentStep < STEP_LABELS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleStepClick = (step: number) => {
    // Only allow clicking on previous steps or current step
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  return (
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
          
          <StepProgressIndicator 
            currentStep={currentStep}
            totalSteps={STEP_LABELS.length}
            stepLabels={STEP_LABELS}
            stepErrors={stepErrors}
            onStepClick={handleStepClick}
          />

          <div className="p-6">
            <form id="project-form" onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === 0 && <ProjectInfoStep form={form} />}
                {currentStep === 1 && <LocationTimelineStep form={form} />}
                {currentStep === 2 && <TeamRequirementsStep form={form} />}
                {currentStep === 3 && <MetadataStep form={form} />}
              </motion.div>
            </form>
          </div>

          <ModalFooter 
            onSubmit={handleSubmit(onSubmit)}
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
