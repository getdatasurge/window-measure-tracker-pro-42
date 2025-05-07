
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
}

export interface UseAddMeasurementFormProps {
  onSuccess: () => void;
  initialProjectId?: string;
  initialProjectName?: string;
}
