import { Direction, MeasurementStatus } from '@/types/measurement';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES = 3;

// Re-export ProjectOption from useProjectList
export type { ProjectOption } from './useProjectList';

export interface MeasurementFormData {
  id?: string;
  projectId: string;
  projectName: string;
  location: string;
  width: string;
  height: string;
  direction?: Direction | string;
  notes?: string;
  filmRequired: boolean;
  quantity: number;
  status?: MeasurementStatus;
  photos: any[]; // Making this accept both File[] and string[]
  installationDate?: string;
  reviewComments?: string;
  tempId?: string;
  isValid?: boolean;
  input_source?: string;
  updatedAt?: string;
  updatedBy?: string;
  area?: string;
  recorded_by?: string; // Add for database operations
  film_required?: boolean; // For backwards compatibility
  measurementDate?: string; // Add for compatibility with Measurement type
  recordedBy?: string; // For UI display
}

export interface MeasurementFormState {
  id?: string;
  projectId: string;
  projectName: string;
  location: string;
  width: string;
  height: string;
  direction?: Direction | string;
  notes?: string;
  filmRequired: boolean;
  quantity: number;
  status?: MeasurementStatus;
  photos: string[];
  installationDate?: string;
  reviewComments?: string;
  area?: string;
  tempId?: string;
  isValid?: boolean;
  input_source?: string;
  updatedAt?: string;
  updatedBy?: string;
  recordedBy?: string;
}

export function convertFormStateToFormData(state: MeasurementFormState): MeasurementFormData {
  return {
    ...state,
    photos: state.photos || [], // Convert string[] to any[]
    filmRequired: state.filmRequired ?? true
  };
}

export interface UseAddMeasurementFormProps {
  onSuccess: () => void;
  initialProjectId?: string;
  initialProjectName?: string;
  editMode?: boolean;
  measurementToEdit?: any;
}

export interface FormErrors {
  projectId?: { message?: string };
  location?: { message?: string };
  width?: { message?: string };
  height?: { message?: string };
  quantity?: { message?: string };
}

export interface PhotoUploadState {
  photoFiles: File[];
  photoErrors: string[];
  uploadProgress: number;
  existingPhotos: string[];
}

export interface PhotoUploadHandlers {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
  uploadPhotos: () => Promise<string[]>;
  resetPhotoState: () => void;
  setInitialPhotos: (photos: string[]) => void;
}

export interface FormSubmissionState {
  isSubmitting: boolean;
}

export interface FormSubmissionHandlers {
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmission: (
    data: MeasurementFormData,
    photoUrls: string[],
    onSuccess?: () => void,
    measurementId?: string
  ) => Promise<any>;
}

export interface ProjectListState {
  projectsList: ProjectOption[];
}

export interface ProjectListHandlers {
  fetchProjects: () => Promise<void>;
}
