
import { Direction, MeasurementStatus } from '@/types/measurement';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES = 3;

export interface MeasurementFormData {
  id?: string;
  projectId: string;
  projectName: string;
  location: string;
  width: string;
  height: string;
  depth?: string;
  direction?: Direction | string;
  notes?: string;
  filmRequired: boolean;
  quantity: number;
  status?: MeasurementStatus;
  photos: File[];
  // Add temporary ID for optimistic updates
  tempId?: string;
  // Add validation status
  isValid?: boolean;
}

export interface UseAddMeasurementFormProps {
  onSuccess: () => void;
  initialProjectId?: string;
  initialProjectName?: string;
}

export interface FormErrors {
  projectId?: { message?: string };
  location?: { message?: string };
  width?: { message?: string };
  height?: { message?: string };
  quantity?: { message?: string };
  depth?: { message?: string };
}

export interface ProjectOption {
  id: string;
  name: string;
}

export interface PhotoUploadState {
  photoFiles: File[];
  photoErrors: string[];
  uploadProgress: number;
}

export interface PhotoUploadHandlers {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
  uploadPhotos: () => Promise<string[]>;
  resetPhotoState: () => void;
}

export interface FormSubmissionState {
  isSubmitting: boolean;
}

export interface FormSubmissionHandlers {
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmission: (
    data: MeasurementFormData,
    photoUrls: string[],
    onSuccess?: () => void
  ) => Promise<any>;
}

export interface ProjectListState {
  projectsList: ProjectOption[];
}

export interface ProjectListHandlers {
  fetchProjects: () => Promise<void>;
}
