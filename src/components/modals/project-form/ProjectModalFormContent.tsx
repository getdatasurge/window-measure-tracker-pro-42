
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectFormValues } from './validation-schema';
import { STEP_LABELS } from './constants';
import ProjectInfoStep from '../steps/ProjectInfoStep';
import LocationTimelineStep from '../steps/LocationTimelineStep';
import TeamRequirementsStep from '../steps/TeamRequirementsStep';
import MetadataStep from '../steps/MetadataStep';
import StepProgressIndicator from '../../projects/StepProgressIndicator';

interface ProjectModalFormContentProps {
  form: UseFormReturn<ProjectFormValues>;
  currentStep: number;
  projectId: string;
  stepErrors: Record<number, boolean>;
  handleStepClick: (step: number) => void;
  completedSteps: number[];
}

const ProjectModalFormContent: React.FC<ProjectModalFormContentProps> = ({
  form,
  currentStep,
  projectId,
  stepErrors,
  handleStepClick,
  completedSteps
}) => {
  // Variants for the step animations
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

  // Track animation direction (1 for forward, -1 for backward)
  const [direction, setDirection] = React.useState(0);

  // Update direction when step changes
  React.useEffect(() => {
    setDirection(currentStep > direction ? 1 : -1);
  }, [currentStep]);

  return (
    <>
      <StepProgressIndicator 
        currentStep={currentStep}
        totalSteps={STEP_LABELS.length}
        stepLabels={STEP_LABELS}
        stepErrors={stepErrors}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      <div className="p-6">
        <form id="project-form">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`step-${currentStep}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: "tween",
                duration: 0.3
              }}
            >
              {currentStep === 0 && <ProjectInfoStep form={form} />}
              {currentStep === 1 && <LocationTimelineStep form={form} />}
              {currentStep === 2 && <TeamRequirementsStep form={form} />}
              {currentStep === 3 && <MetadataStep form={form} />}
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </>
  );
};

export default ProjectModalFormContent;
