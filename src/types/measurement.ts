
// Define measurement related types
export type MeasurementStatus = 'Pending' | 'Film_Cut' | 'Installed' | 'Completed';
export type Direction = 'North' | 'South' | 'East' | 'West' | 'N/A';

export interface Measurement {
  id: string;
  projectId?: string;
  projectName: string;
  location: string;
  width: string; 
  height: string;
  depth?: string;
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
