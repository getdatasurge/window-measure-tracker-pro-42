
/**
 * Measurement interface for the measurement feature
 */
export interface Measurement {
  id: string;
  projectId: string;
  projectName: string;
  measurementDate: string;
  recordedBy: string;
  width: string;
  height: string;
  area: string; // Making area non-optional to match other implementations
  quantity: number;
  direction: string;
  notes?: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
  film_required?: boolean;
  installationDate?: string;
  photos?: string[];
  location: string;
  input_source?: string;
}

/**
 * Measurement filter options
 */
export interface MeasurementFilter {
  projectId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
}

/**
 * Basic measurement analytics data interface
 */
export interface MeasurementAnalytics {
  totalCount: number;
  pendingCount: number;
  completedCount: number;
  lastUpdatedAt: Date | null;
}
