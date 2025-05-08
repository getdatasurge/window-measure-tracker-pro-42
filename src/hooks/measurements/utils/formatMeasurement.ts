
import { Measurement, MeasurementStatus } from '@/types/measurement';

/**
 * Format raw measurement data from the database to match the Measurement interface
 */
export function formatMeasurement(rawData: any): Measurement {
  // Get the project name from the nested projects object if available
  const projectName = rawData.projects ? rawData.projects.name : '';
  
  // Convert numeric fields to strings to match the Measurement interface
  return {
    id: rawData.id,
    projectId: rawData.project_id || '', // Ensure projectId is not undefined
    measurementDate: rawData.measurement_date,
    projectName: projectName || '',
    createdAt: rawData.created_at,
    updatedAt: rawData.updated_at,
    recordedBy: rawData.recorded_by || '',
    width: String(rawData.width || ''), // Convert to string
    height: String(rawData.height || ''), // Convert to string
    area: String(rawData.area || ''), // Convert to string
    status: (rawData.status || 'Pending') as MeasurementStatus, // Cast to MeasurementStatus
    location: rawData.location || '',
    direction: rawData.direction || 'N/A',
    notes: rawData.notes || '',
    quantity: rawData.quantity || 1,
    film_required: rawData.film_required,
    installationDate: rawData.installation_date,
    photos: Array.isArray(rawData.photos) ? rawData.photos : [], // Ensure photos is always an array
    updatedBy: rawData.updated_by || ''
  } as Measurement;
}
