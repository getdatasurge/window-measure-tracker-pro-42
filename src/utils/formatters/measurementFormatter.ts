
import { Measurement, MeasurementStatus } from '@/types/measurement';

/**
 * Safely formats measurement data from the database, handling missing columns gracefully
 */
export const formatMeasurement = (dbMeasurement: any): Measurement => {
  // Safely get numeric values and format them
  const safeNumber = (value: any): string => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value?.toString() || '0';
  };

  // Format status with proper capitalization and type safety
  const formatStatus = (status: string): MeasurementStatus => {
    if (!status) return 'Pending';
    
    // Capitalize first letter
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    
    // Ensure it's a valid MeasurementStatus
    const validStatuses: MeasurementStatus[] = ['Pending', 'Film_Cut', 'Installed', 'Completed'];
    return validStatuses.includes(formattedStatus as MeasurementStatus) 
      ? (formattedStatus as MeasurementStatus) 
      : 'Pending';
  };

  // Format all measurement values for display
  return {
    id: dbMeasurement.id,
    projectId: dbMeasurement.project_id,
    projectName: dbMeasurement.projects?.name || 'Unknown Project',
    location: dbMeasurement.location || '',
    width: safeNumber(dbMeasurement.width),
    height: safeNumber(dbMeasurement.height),
    depth: dbMeasurement.depth ? `${safeNumber(dbMeasurement.depth)}"` : undefined,
    area: dbMeasurement.area ? `${safeNumber(dbMeasurement.area)} ft²` : '0 ft²',
    quantity: dbMeasurement.quantity || 1,
    recordedBy: dbMeasurement.recorded_by || '',
    direction: (dbMeasurement.direction || 'N/A'),
    notes: dbMeasurement.notes || '',
    status: formatStatus(dbMeasurement.status),
    measurementDate: dbMeasurement.measurement_date || new Date().toISOString(),
    updatedAt: dbMeasurement.updated_at || new Date().toISOString(),
    updatedBy: dbMeasurement.updated_by || '',
    photos: dbMeasurement.photos || [],
    film_required: dbMeasurement.film_required !== false,
    // Safely handle potentially missing columns
    input_source: dbMeasurement.input_source || 'manual'
  };
};
