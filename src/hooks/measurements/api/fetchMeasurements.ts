
import { supabase } from '@/integrations/supabase/client';
import { Measurement, MeasurementStatus } from '@/types/measurement';
import { formatMeasurement } from '../utils/formatMeasurement';

// Define options for measurement fetching
export interface MeasurementFetchOptions {
  projectId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Fetch measurements data from Supabase
 */
export async function fetchMeasurementsData(options: MeasurementFetchOptions = {}): Promise<Measurement[]> {
  try {
    let query = supabase.from('measurements').select(`
      *,
      projects (name)
    `);
    
    // Apply filters if provided
    if (options.projectId) {
      query = query.eq('project_id', options.projectId);
    }
    
    if (options.status) {
      query = query.eq('status', options.status);
    }
    
    if (options.startDate) {
      query = query.gte('measurement_date', options.startDate.toISOString());
    }
    
    if (options.endDate) {
      query = query.lte('measurement_date', options.endDate.toISOString());
    }
    
    // Fetch data
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching measurements:', error);
      throw error;
    }
    
    // Transform data to ensure types match Measurement interface
    if (data) {
      return data.map(item => formatMeasurement(item));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching measurements:', error);
    return [];
  }
}
