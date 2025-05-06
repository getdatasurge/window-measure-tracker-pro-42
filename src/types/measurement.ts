
// Define measurement related types
export type MeasurementStatus = 'Pending' | 'Film Cut' | 'Installed' | 'Under Review' | 'Completed';
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
  glassType?: string;
  notes?: string;
  status: MeasurementStatus;
  measurementDate: string;
  updatedAt: string;
  updatedBy?: string;
  approvalBy?: string;
  reviewComments?: string;
  film_required?: boolean;
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
