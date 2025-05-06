
import { Measurement } from '@/types/measurement';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch measurements for a specific date
 */
export const fetchMeasurementsForDay = async (date: Date): Promise<Measurement[]> => {
  try {
    // Format date to ISO string for Supabase query
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    const { data, error } = await supabase
      .from('measurements')
      .select(`
        id,
        project_id,
        location,
        width,
        height,
        depth,
        area,
        quantity,
        recorded_by,
        direction,
        notes,
        status,
        measurement_date,
        updated_at,
        updated_by,
        projects (name),
        photos
      `)
      .gte('measurement_date', startDate.toISOString())
      .lt('measurement_date', endDate.toISOString())
      .order('measurement_date', { ascending: false });
      
    if (error) throw error;
    
    // Transform the data to match our Measurement type
    return data.map(item => ({
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
      photos: item.photos || [],
    }));
  } catch (error) {
    console.error('Error fetching measurements for day:', error);
    return [];
  }
};

/**
 * Fetch measurements filtered by status
 */
export const fetchMeasurementsByStatus = async (status: string): Promise<Measurement[]> => {
  try {
    const { data, error } = await supabase
      .from('measurements')
      .select(`
        id,
        project_id,
        location,
        width,
        height,
        depth,
        area,
        quantity,
        recorded_by,
        direction,
        notes,
        status,
        measurement_date,
        updated_at,
        updated_by,
        projects (name),
        photos
      `)
      .eq('status', status.toLowerCase())
      .order('updated_at', { ascending: false });
      
    if (error) throw error;
    
    // Transform the data to match our Measurement type
    return data.map(item => ({
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
      photos: item.photos || [],
    }));
  } catch (error) {
    console.error('Error fetching measurements by status:', error);
    return [];
  }
};

/**
 * Fetch all measurements
 */
export const fetchMeasurements = async (): Promise<Measurement[]> => {
  try {
    const { data, error } = await supabase
      .from('measurements')
      .select(`
        id,
        project_id,
        location,
        width,
        height,
        depth,
        area,
        quantity,
        recorded_by,
        direction,
        notes,
        status,
        measurement_date,
        updated_at,
        updated_by,
        projects (name),
        photos
      `)
      .order('updated_at', { ascending: false });
      
    if (error) throw error;
    
    // Transform the data to match our Measurement type
    return data.map(item => ({
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
      photos: item.photos || [],
    }));
  } catch (error) {
    console.error('Error fetching all measurements:', error);
    return [];
  }
};

// Mock functions to support older components until we fully migrate to Supabase
// These will return empty arrays but maintain the expected API
export const getMeasurementsForDay = async (date: Date): Promise<Measurement[]> => {
  return fetchMeasurementsForDay(date);
};

export const getMeasurementsByStatus = async (status: string): Promise<Measurement[]> => {
  return fetchMeasurementsByStatus(status);
};

export const getArchivedMeasurements = async (): Promise<Measurement[]> => {
  return fetchMeasurements();
};
