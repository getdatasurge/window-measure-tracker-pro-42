
import { Project } from "@/types/project";

export interface ProjectFormData {
  id?: string;
  name: string;
  description: string;
  status: string;
  client: string;
  dueDate: string | Date | null;
  
  // Location details
  location: string | {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
  };
  
  // Project metadata
  type: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  budgetEstimate: number | null;
  
  // Timeline information
  timeline: {
    startDate: string | Date | null;
    endDate: string | Date | null;
    phases?: {
      name: string;
      startDate: string | Date | null;
      endDate: string | Date | null;
    }[];
  };
  
  // Team requirements
  team: {
    members: {
      id: string;
      role: string;
    }[];
    requiredRoles: string[];
  };
  estimatedWindows: number | null;
  instructions: string;
  
  // File attachments
  attachments: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
  
  // Audit information
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface ProjectFormErrors {
  name?: string;
  description?: string;
  client?: string;
  dueDate?: string;
  location?: string;
  attachments?: string;
  team?: string;
  timeline?: string;
  [key: string]: string | undefined;
}

export type ProjectFormStep = 
  | 'info'
  | 'location'
  | 'team'
  | 'attachments'
  | 'review';

export interface UseProjectFormReturn {
  formData: ProjectFormData;
  setFormData: (data: Partial<ProjectFormData>) => void;
  errors: ProjectFormErrors;
  setErrors: (errors: ProjectFormErrors) => void;
  validateForm: () => boolean;
  handleSubmit: () => void;
  isSubmitting: boolean;
  resetForm: () => void;
  currentStep: ProjectFormStep;
  setCurrentStep: (step: ProjectFormStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

export const projectFormDataToProject = (formData: ProjectFormData): Project => {
  return {
    id: formData.id || crypto.randomUUID(),
    name: formData.name,
    description: formData.description,
    status: formData.status,
    client: formData.client,
    dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    createdAt: formData.createdAt ? new Date(formData.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: formData.updatedAt ? new Date(formData.updatedAt).toISOString() : new Date().toISOString(),
    // Add additional fields as needed from formData
  };
};
