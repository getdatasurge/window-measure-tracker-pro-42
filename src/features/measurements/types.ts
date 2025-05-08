
/**
 * Measurement types definition
 */

import { Direction } from '@/constants/direction';
import { MeasurementStatus } from '@/types/measurement';

export interface Measurement {
  id: string;
  projectId: string; // Changed from optional to required
  projectName: string;
  location: string;
  width: string;
  height: string;
  area: string; // Changed from optional to required to match the type in types/measurement.ts
  quantity: number;
  recordedBy: string;
  direction: Direction;
  notes: string;
  film_required?: boolean;
  status: MeasurementStatus; // Update to use MeasurementStatus enum
  photos?: string[];
  updatedAt: string;
  updatedBy: string;
  installationDate?: string;
  input_source?: string;
  measurementDate: string;
  createdAt?: string;
}

export interface MeasurementFormData {
  id?: string;
  projectId: string; // Changed from optional to required
  projectName: string; // Changed from optional to required
  location: string;
  width?: string;
  height?: string;
  area?: string;
  quantity?: number;
  recordedBy?: string;
  direction?: string;
  notes?: string;
  filmRequired?: boolean;
  status?: MeasurementStatus; // Update to use MeasurementStatus enum
  photos?: string[];
  updatedAt?: string;
  updatedBy?: string;
  installationDate?: string;
  input_source?: string;
  measurementDate?: string;
}

export interface FormSubmissionState {
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FormSubmissionHandlers {
  handleSubmission: (
    data: MeasurementFormData,
    photoUrls: string[],
    onSuccess?: () => void,
    measurementId?: string
  ) => Promise<any>;
}

export interface MeasurementStat {
  count: number;
  status: string;
  color: string;
}
