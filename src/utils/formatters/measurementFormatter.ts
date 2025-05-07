
import { Measurement } from '@/types/measurement';

/**
 * Format a database measurement record to match the frontend Measurement interface
 */
export const formatMeasurement = (item: any): Measurement => {
  return {
    id: item.id,
    projectId: item.project_id,
    projectName: item.projects?.name || 'Unknown Project',
    location: item.location || '',
    width: typeof item.width === 'number' ? `${item.width}"` : (item.width || '0"'),
    height: typeof item.height === 'number' ? `${item.height}"` : (item.height || '0"'),
    depth: item.depth ? `${item.depth}"` : undefined,
    area: item.area ? `${item.area} ft²` : '0 ft²',
    quantity: item.quantity || 1,
    recordedBy: item.recorded_by || '',
    direction: (item.direction || 'N/A') as any,
    notes: item.notes,
    status: (item.status || 'Pending') as any,
    measurementDate: item.measurement_date || new Date().toISOString(),
    updatedAt: item.updated_at || new Date().toISOString(),
    updatedBy: item.updated_by,
    film_required: item.film_required,
    photos: Array.isArray(item.photos) ? item.photos : [],
  };
};
