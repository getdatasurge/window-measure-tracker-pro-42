
import { Project } from "@/types/project";
import { ProjectFormData as BaseProjectFormData } from "@/types/project";

// Re-export the ProjectFormData type from project types
export type ProjectFormData = BaseProjectFormData;

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

export interface UseProjectFormProps {
  onCreateProject?: (data: ProjectFormData) => void;
  onClose?: () => void;
  defaultValues?: Partial<ProjectFormData>;
}

export interface UseProjectFormReturn {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: ProjectFormData;
  errors: Partial<Record<string, string>>;
  projectId: string;
  resetForm: () => void;
  updateFormData: (field: string, value: any) => void;
  handleSubmit: () => void;
  draftSaved: boolean;
  saveDraft: () => void;
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
    entries_count: formData.entries_count || 0,
  };
};
