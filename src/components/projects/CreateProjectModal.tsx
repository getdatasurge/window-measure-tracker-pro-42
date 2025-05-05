
import React from 'react';
import { ProjectFormData } from '@/types/project';
import { MultiStepFormModal } from '@/components/form';
import { StepSchema } from '@/components/form/types';

export interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (data: ProjectFormData) => void;
  defaultValues?: Partial<ProjectFormData>;
  submitButtonText?: string;
}

const projectFormSteps: StepSchema[] = [
  {
    title: "Project Info",
    description: "Enter the basic information about your project",
    fields: [
      {
        name: "name",
        label: "Project Name",
        type: "text",
        placeholder: "Enter project name",
        validation: { required: "Project name is required" }
      },
      {
        name: "type",
        label: "Project Type",
        type: "select",
        placeholder: "Select a project type",
        options: [
          { label: "Residential", value: "residential" },
          { label: "Commercial", value: "commercial" },
          { label: "Industrial", value: "industrial" }
        ],
        validation: { required: "Project type is required" }
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Describe your project",
        rows: 3
      }
    ],
    columns: 1
  },
  {
    title: "Location & Timeline",
    description: "Specify where and when the project will take place",
    fields: [
      {
        name: "location.addressLine1",
        label: "Address Line 1",
        type: "text",
        placeholder: "Enter address",
        validation: { required: "Address is required" }
      },
      {
        name: "location.addressLine2",
        label: "Address Line 2",
        type: "text",
        placeholder: "Apartment, suite, etc."
      },
      {
        name: "location.city",
        label: "City",
        type: "text",
        placeholder: "City",
        validation: { required: "City is required" }
      },
      {
        name: "location.state",
        label: "State",
        type: "text",
        placeholder: "State",
        validation: { required: "State is required" }
      },
      {
        name: "location.zip",
        label: "ZIP Code",
        type: "text",
        placeholder: "ZIP Code",
        validation: { required: "ZIP Code is required" }
      },
      {
        name: "timeline.startDate",
        label: "Start Date",
        type: "date",
        validation: { required: "Start date is required" }
      },
      {
        name: "timeline.endDate",
        label: "End Date",
        type: "date"
      }
    ],
    columns: 2
  },
  {
    title: "Team & Requirements",
    description: "Define team roles and project requirements",
    fields: [
      {
        name: "team.projectManager",
        label: "Project Manager",
        type: "text",
        placeholder: "Select project manager",
        validation: { required: "Project manager is required" }
      },
      {
        name: "estimatedWindows",
        label: "Estimated Number of Windows",
        type: "number",
        placeholder: "0",
        validation: { min: { value: 1, message: "Must have at least 1 window" } }
      },
      {
        name: "instructions",
        label: "Special Instructions",
        type: "textarea",
        placeholder: "Add any special instructions here",
        rows: 4
      }
    ],
    columns: 1
  },
  {
    title: "Attachments & Metadata",
    description: "Add files and additional metadata to your project",
    fields: [
      {
        name: "priority",
        label: "Priority",
        type: "select",
        options: [
          { label: "Low", value: "Low" },
          { label: "Medium", value: "Medium" },
          { label: "High", value: "High" }
        ],
        defaultValue: "Medium"
      },
      {
        name: "budgetEstimate",
        label: "Budget Estimate",
        type: "number",
        placeholder: "$ 0.00"
      }
    ],
    columns: 2
  }
];

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  onOpenChange,
  onCreateProject,
  defaultValues,
  submitButtonText = "Create Project"
}) => {
  const handleCreateProject = (data: any) => {
    onCreateProject?.(data as ProjectFormData);
  };

  return (
    <MultiStepFormModal 
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Create New Project"
      description="Fill in the project details to create a new project"
      steps={projectFormSteps}
      defaultValues={defaultValues || {}}
      onSubmit={handleCreateProject}
      submitButtonText={submitButtonText}
    />
  );
};

export default CreateProjectModal;
