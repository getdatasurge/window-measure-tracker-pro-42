
/**
 * Utility functions for formatting measurement data
 */
import { Measurement } from '@/features/measurements/types';

/**
 * Format raw database measurement data to the Measurement interface format
 */
export function formatMeasurement(data: any): Measurement {
  return {
    id: data.id,
    projectId: data.project_id,
    projectName: data.projects?.name || '',
    location: data.location || '',
    width: String(data.width || ''),
    height: String(data.height || ''),
    area: String(data.area || ''),
    quantity: data.quantity || 1,
    recordedBy: data.recorded_by || '',
    direction: data.direction || 'N/A',
    notes: data.notes || '',
    film_required: data.film_required,
    status: data.status || 'Pending',
    photos: Array.isArray(data.photos) ? data.photos : [],
    updatedAt: data.updated_at || new Date().toISOString(),
    updatedBy: data.updated_by || '',
    installationDate: data.installation_date,
    input_source: data.input_source || 'manual',
    measurementDate: data.measurement_date || new Date().toISOString()
    // Removed createdAt as it's not in the Measurement interface
  };
}

/**
 * Format front-end measurement data to database format for submission
 */
export function formatMeasurementForSubmission(measurement: Measurement): any {
  return {
    project_id: measurement.projectId,
    location: measurement.location,
    width: parseFloat(measurement.width) || null,
    height: parseFloat(measurement.height) || null,
    area: parseFloat(measurement.area || '') || null,
    quantity: measurement.quantity,
    recorded_by: measurement.recordedBy,
    direction: measurement.direction,
    notes: measurement.notes,
    film_required: measurement.film_required,
    status: measurement.status,
    photos: measurement.photos,
    updated_at: measurement.updatedAt,
    updated_by: measurement.updatedBy,
    installation_date: measurement.installationDate,
    input_source: measurement.input_source,
    measurement_date: measurement.measurementDate
  };
}
