
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
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
}

const ProjectModalFormContent: React.FC<ProjectModalFormContentProps> = ({
  form,
  currentStep,
  projectId,
  stepErrors,
  handleStepClick
}) => {
  return (
    <>
      <StepProgressIndicator 
        currentStep={currentStep}
        totalSteps={STEP_LABELS.length}
        stepLabels={STEP_LABELS}
        stepErrors={stepErrors}
        onStepClick={handleStepClick}
      />

      <div className="p-6">
        <form id="project-form">
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
    </>
  );
};

export default ProjectModalFormContent;
