// Define measurement related types
export type MeasurementStatus = 'Pending' | 'Film_Cut' | 'Installed' | 'Completed';
// Import Direction type from constants instead of defining it here
import { Direction } from '@/constants/direction';
export type { Direction }; // Changed to "export type" to fix the isolatedModules error

export interface Measurement {
  id: string;
  projectId?: string;
  projectName: string;
  location: string;
  width: string; 
  height: string;
  area: string;
  quantity: number;
  recordedBy: string;
  direction: Direction;
  notes?: string;
  status: MeasurementStatus;
  measurementDate: string;
  updatedAt: string;
  updatedBy?: string;
  approvalBy?: string;
  reviewComments?: string;
  film_required?: boolean;
  photos?: string[];
  recorded_by?: string; // User ID for database purposes
  installationDate?: string; // Installation date property
  input_source?: string; // Adding input source field
}

export interface MeasurementFormData {
  projectId?: string;
  projectName: string;
  location: string;
  width: string;
  height: string;
  area: string;
  quantity: number;
  recordedBy: string;
  direction: Direction;
  notes?: string;
  status: MeasurementStatus;
  measurementDate: string;
  film_required?: boolean;
  installationDate?: string;
}

// Helper functions for safely parsing potentially untyped string values
export function parseDirection(directionString: string | undefined): Direction {
  if (!directionString || !DIRECTION_OPTIONS.includes(directionString as Direction)) {
    return 'N/A';
  }
  return directionString as Direction;
}

export function parseInputSource(source: string | undefined): string | undefined {
  return source;
}

export interface MeasurementFilter {
  projectId?: string;
  location?: string;
  status?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  installer?: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface Installer {
  id: string;
  name: string;
}

export interface StatusOption {
  value: string;
  label: string;
}
