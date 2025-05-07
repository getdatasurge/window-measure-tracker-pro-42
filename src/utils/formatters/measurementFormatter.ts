
import { Measurement } from '@/types/measurement';

/**
 * Formats a raw measurement from the database into a typed Measurement object
 */
export const formatMeasurement = (rawData: any): Measurement => {
  return {
    id: rawData.id,
    projectId: rawData.project_id,
    projectName: rawData.projects?.name || 'Unknown Project',
    measurementDate: rawData.measurement_date || new Date().toISOString(),
    createdAt: rawData.created_at || new Date().toISOString(),
    updatedAt: rawData.updated_at || new Date().toISOString(),
    recordedBy: rawData.recorded_by || '',
    width: String(rawData.width || ''),
    height: String(rawData.height || ''),
    area: String(rawData.area || ''),
    status: (rawData.status || 'Pending'),
    location: rawData.location || '',
    direction: (rawData.direction || 'N/A'),
    notes: rawData.notes,
    quantity: rawData.quantity || 1,
    film_required: rawData.film_required,
    installationDate: rawData.installation_date,
    photos: Array.isArray(rawData.photos) ? rawData.photos : [],
  } as Measurement;
};

export default formatMeasurement;
