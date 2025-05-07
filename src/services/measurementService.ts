
import { supabase } from '@/integrations/supabase/client';
import { formatMeasurement } from '@/utils/formatters/measurementFormatter';
import { Measurement } from '@/types/measurement';

/**
 * Fetch measurements from the database with optional filtering
 */
export const fetchMeasurementsData = async (
  options: {
    projectId?: string;
    date?: Date;
    status?: string;
  } = {}
): Promise<Measurement[]> => {
  try {
    // Build the query based on the options
    let query = supabase
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
        photos,
        film_required,
        projects (name)
      `)
      .eq('deleted', false)
      .order('updated_at', { ascending: false });
    
    // Add filters based on options
    if (options.projectId) {
      query = query.eq('project_id', options.projectId);
    }
    
    if (options.date) {
      const startDate = new Date(options.date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(options.date);
      endDate.setHours(23, 59, 59, 999);
      
      query = query
        .gte('measurement_date', startDate.toISOString())
        .lt('measurement_date', endDate.toISOString());
    }
    
    if (options.status) {
      query = query.eq('status', options.status.toLowerCase());
    }
    
    // Execute query
    console.log("Executing measurements query with options:", options);
    const { data, error } = await query;
    
    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} measurements`);
    
    // Transform the data to match our Measurement type
    return (data || []).map(formatMeasurement);
  } catch (err) {
    console.error('Error fetching measurements:', err);
    throw err instanceof Error ? err : new Error('Failed to fetch measurements');
  }
};
