
import { ProjectFormData } from '@/types/project';

export interface UseProjectFormProps {
  onCreateProject?: (data: ProjectFormData) => void;
  onClose: () => void;
  defaultValues?: Partial<ProjectFormData>;
}

export interface UseProjectFormReturn {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: ProjectFormData;
  errors: Partial<Record<string, string>>;
  projectId: string;
  resetForm: (useSavedDraft?: boolean) => void;
  updateFormData: (field: string, value: any) => void;
  handleSubmit: () => void;
  hasSavedDraft: () => boolean;
  clearSavedDraft: () => void;
}
