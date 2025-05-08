
export type MeasurementStatus = 
  | 'Pending'
  | 'In Progress'
  | 'Completed'
  | 'Under Review'
  | 'Film Cut'
  | 'Installed'
  | 'Cancelled';

export interface Measurement {
  id: string;
  projectId: string;
  projectName: string;
  location: string;
  width: string;
  height: string;
  area: string; // Making area required, not optional
  direction?: string;
  quantity: number;
  measurementDate: string;
  notes?: string;
  status: MeasurementStatus;
  recordedBy: string;
  updatedAt: string;
  updatedBy: string;
  film_required?: boolean;
  installationDate?: string;
  photos?: string[];
  input_source?: string;
  approvalBy?: string; // Added missing property
}

export interface MeasurementCreateInput {
  projectId: string;
  location: string;
  width: string;
  height: string;
  direction?: string;
  notes?: string;
  film_required?: boolean;
  quantity: number;
  recordedBy: string;
}

export interface MeasurementUpdateInput {
  id: string;
  location?: string;
  width?: string;
  height?: string;
  direction?: string;
  notes?: string;
  film_required?: boolean;
  quantity?: number;
  status?: MeasurementStatus;
  installationDate?: string;
}

// Adding the missing exported types
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
