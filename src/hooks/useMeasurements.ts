
import { useState, useEffect, useCallback } from 'react';
import { Measurement } from '@/types/measurement';
import { supabase } from '@/integrations/supabase/client';

// Simple options interface without complex types
interface MeasurementsQueryOptions {
  projectId?: string;
  date?: Date;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Hook to fetch measurements with optional filtering
 */
export const useMeasurements = (options: MeasurementsQueryOptions = {}) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch measurements based on filters
  const fetchMeasurements = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('measurements').select(`
        id,
        project_id,
        measurement_date,
        created_at,
        updated_at,
        recorded_by,
        width,
        height,
        area,
        status,
        location,
        direction,
        notes,
        quantity,
        film_required,
        installation_date,
        photos,
        projects (name)
      `);
      
      // Apply filters if provided
      if (options.projectId) {
        query = query.eq('project_id', options.projectId);
      }
      
      if (options.status) {
        query = query.eq('status', options.status);
      }
      
      if (options.date) {
        const startOfDay = new Date(options.date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(options.date);
        endOfDay.setHours(23, 59, 59, 999);
        
        query = query
          .gte('measurement_date', startOfDay.toISOString())
          .lte('measurement_date', endOfDay.toISOString());
      }
      
      if (options.startDate && options.endDate) {
        query = query
          .gte('measurement_date', options.startDate.toISOString())
          .lte('measurement_date', options.endDate.toISOString());
      }
      
      const { data, error } = await query.order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedMeasurements: Measurement[] = data.map(item => ({
        id: item.id,
        projectId: item.project_id,
        projectName: item.projects?.name || 'Unknown Project',
        measurementDate: item.measurement_date,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        recordedBy: item.recorded_by || '',
        width: String(item.width || ''),
        height: String(item.height || ''),
        area: String(item.area || ''),
        status: (item.status || 'Pending') as Measurement['status'],
        location: item.location || '',
        direction: (item.direction || 'N/A') as Measurement['direction'],
        notes: item.notes,
        quantity: item.quantity || 1,
        film_required: item.film_required,
        installationDate: item.installation_date,
        photos: Array.isArray(item.photos) ? item.photos : [],
      }));
      
      setMeasurements(formattedMeasurements);
      setError(null);
      return formattedMeasurements;
    } catch (err) {
      console.error('Error fetching measurements:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch measurements'));
      return [];
    } finally {
      setLoading(false);
    }
  }, [options.projectId, options.date, options.status, options.startDate, options.endDate]);
  
  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchMeasurements();
  }, [fetchMeasurements]);
  
  // Get measurements grouped by date
  const getMeasurementsByDate = useCallback((date: Date) => {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    return measurements.filter(m => {
      const measurementDate = new Date(m.measurementDate);
      return measurementDate >= startDate && measurementDate <= endDate;
    });
  }, [measurements]);
  
  // Get measurements by status
  const getMeasurementsByStatus = useCallback((status: string | string[]) => {
    if (Array.isArray(status)) {
      return measurements.filter(m => 
        status.some(s => m.status.toLowerCase() === s.toLowerCase())
      );
    }
    
    return measurements.filter(m => 
      m.status.toLowerCase() === status.toLowerCase()
    );
  }, [measurements]);
  
  return {
    measurements,
    isLoading: loading,
    error,
    refetchMeasurements: fetchMeasurements,
    getMeasurementsByDate,
    getMeasurementsByStatus
  };
};

// Export for use in other modules
export { setupMeasurementsSubscription } from '@/services/realtimeService';

// Helper functions for measurements
export const getMeasurementsForDay = async (date: Date): Promise<Measurement[]> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  try {
    const { data, error } = await supabase
      .from('measurements')
      .select(`
        id,
        project_id,
        measurement_date,
        created_at,
        updated_at,
        recorded_by,
        width,
        height,
        area,
        status,
        location,
        direction,
        notes,
        quantity,
        film_required,
        installation_date,
        photos,
        projects (name)
      `)
      .gte('measurement_date', startOfDay.toISOString())
      .lte('measurement_date', endOfDay.toISOString())
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      projectId: item.project_id,
      projectName: item.projects?.name || 'Unknown Project',
      measurementDate: item.measurement_date,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      recordedBy: item.recorded_by || '',
      width: String(item.width || ''),
      height: String(item.height || ''),
      area: String(item.area || ''),
      status: (item.status || 'Pending') as Measurement['status'],
      location: item.location || '',
      direction: (item.direction || 'N/A') as Measurement['direction'],
      notes: item.notes,
      quantity: item.quantity || 1,
      film_required: item.film_required,
      installationDate: item.installation_date,
      photos: Array.isArray(item.photos) ? item.photos : [],
    }));
  } catch (err) {
    console.error('Error in getMeasurementsForDay:', err);
    return [];
  }
};

export const getMeasurementsByStatus = async (status: string): Promise<Measurement[]> => {
  try {
    const { data, error } = await supabase
      .from('measurements')
      .select(`
        id,
        project_id,
        measurement_date,
        created_at,
        updated_at,
        recorded_by,
        width,
        height,
        area,
        status,
        location,
        direction,
        notes,
        quantity,
        film_required,
        installation_date,
        photos,
        projects (name)
      `)
      .eq('status', status)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      projectId: item.project_id,
      projectName: item.projects?.name || 'Unknown Project',
      measurementDate: item.measurement_date,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      recordedBy: item.recorded_by || '',
      width: String(item.width || ''),
      height: String(item.height || ''),
      area: String(item.area || ''),
      status: (item.status || 'Pending') as Measurement['status'],
      location: item.location || '',
      direction: (item.direction || 'N/A') as Measurement['direction'],
      notes: item.notes,
      quantity: item.quantity || 1,
      film_required: item.film_required,
      installationDate: item.installation_date,
      photos: Array.isArray(item.photos) ? item.photos : [],
    }));
  } catch (err) {
    console.error('Error in getMeasurementsByStatus:', err);
    return [];
  }
};

export const fetchMeasurements = async (): Promise<Measurement[]> => {
  try {
    const { data, error } = await supabase
      .from('measurements')
      .select(`
        id,
        project_id,
        measurement_date,
        created_at,
        updated_at,
        recorded_by,
        width,
        height,
        area,
        status,
        location,
        direction,
        notes,
        quantity,
        film_required,
        installation_date,
        photos,
        projects (name)
      `)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      projectId: item.project_id,
      projectName: item.projects?.name || 'Unknown Project',
      measurementDate: item.measurement_date,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      recordedBy: item.recorded_by || '',
      width: String(item.width || ''),
      height: String(item.height || ''),
      area: String(item.area || ''),
      status: (item.status || 'Pending') as Measurement['status'],
      location: item.location || '',
      direction: (item.direction || 'N/A') as Measurement['direction'],
      notes: item.notes,
      quantity: item.quantity || 1,
      film_required: item.film_required,
      installationDate: item.installation_date,
      photos: Array.isArray(item.photos) ? item.photos : [],
    }));
  } catch (err) {
    console.error('Error in fetchMeasurements:', err);
    return [];
  }
};

export const getArchivedMeasurements = async (): Promise<Measurement[]> => {
  try {
    const { data, error } = await supabase
      .from('measurements')
      .select(`
        id,
        project_id,
        measurement_date,
        created_at,
        updated_at,
        recorded_by,
        width,
        height,
        area,
        status,
        location,
        direction,
        notes,
        quantity,
        film_required,
        installation_date,
        photos,
        projects (name)
      `)
      .eq('deleted', true)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      projectId: item.project_id,
      projectName: item.projects?.name || 'Unknown Project',
      measurementDate: item.measurement_date,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      recordedBy: item.recorded_by || '',
      width: String(item.width || ''),
      height: String(item.height || ''),
      area: String(item.area || ''),
      status: (item.status || 'Pending') as Measurement['status'],
      location: item.location || '',
      direction: (item.direction || 'N/A') as Measurement['direction'],
      notes: item.notes,
      quantity: item.quantity || 1,
      film_required: item.film_required,
      installationDate: item.installation_date,
      photos: Array.isArray(item.photos) ? item.photos : [],
    }));
  } catch (err) {
    console.error('Error in getArchivedMeasurements:', err);
    return [];
  }
};
