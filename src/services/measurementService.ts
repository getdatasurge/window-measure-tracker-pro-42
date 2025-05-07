
import { supabase } from '@/integrations/supabase/client';
import { formatMeasurement } from '@/utils/formatters/measurementFormatter';
import { Measurement } from '@/types/measurement';
import { safeFrom } from '@/utils/db/safeQueryBuilder';
import { validateColumns, getAvailableColumns } from '@/utils/db/schemaValidator';

/**
 * Safely builds a measurement query with validated columns
 */
const buildSafeMeasurementQuery = async (options: any = {}) => {
  // Get the actual available columns
  const availableColumns = await getAvailableColumns('measurements');
  
  // Define the columns we want to select
  const desiredColumns = [
    'id', 
    'project_id',
    'location',
    'width', 
    'height', 
    'depth', 
    'area', 
    'quantity',
    'recorded_by',
    'direction',
    'notes',
    'status',
    'measurement_date',
    'updated_at',
    'updated_by',
    'photos',
    'film_required',
    'input_source'  // This is the column that might not exist
  ];
  
  // Filter to only include columns that actually exist in the database
  const validColumns = desiredColumns.filter(col => 
    availableColumns.includes(col)
  );
  
  console.log('Available measurement columns:', availableColumns);
  console.log('Using validated columns:', validColumns);
  
  // Always include the projects relation
  const selectString = `
    ${validColumns.join(', ')},
    projects (name)
  `;
  
  // Start building the query
  let query = supabase
    .from('measurements')
    .select(selectString)
    .eq('deleted', false)
    .order('updated_at', { ascending: false });
    
  // Add filters based on options
  if (options.projectId) {
    query = query.eq('project_id', options.projectId);
  }
  
  // Single date filter
  if (options.date) {
    const startDate = new Date(options.date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(options.date);
    endDate.setHours(23, 59, 59, 999);
    
    query = query
      .gte('measurement_date', startDate.toISOString())
      .lt('measurement_date', endDate.toISOString());
  }
  // Date range filter (startDate to endDate)
  else if (options.startDate && options.endDate) {
    const startDate = new Date(options.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(options.endDate);
    endDate.setHours(23, 59, 59, 999);
    
    query = query
      .gte('measurement_date', startDate.toISOString())
      .lte('measurement_date', endDate.toISOString());
  }
  
  if (options.status) {
    query = query.eq('status', options.status.toLowerCase());
  }
  
  return query;
};

/**
 * Fetch measurements from the database with optional filtering and schema validation
 */
export const fetchMeasurementsData = async (
  options: {
    projectId?: string;
    date?: Date;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}
): Promise<Measurement[]> => {
  try {
    // Execute query with schema validation
    console.log("Executing measurements query with options:", options);
    const query = await buildSafeMeasurementQuery(options);
    const { data, error } = await query;
    
    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} measurements`);
    
    // Transform the data to match our Measurement type
    return (data || []).map(item => formatMeasurement(item));
  } catch (err) {
    console.error('Error fetching measurements:', err);
    throw err instanceof Error ? err : new Error('Failed to fetch measurements');
  }
};

/**
 * Save a measurement with schema validation to prevent errors
 */
export const saveMeasurement = async (measurement: any, userId: string): Promise<any> => {
  try {
    // Convert the measurement object to match database schema
    const dbFields = {
      project_id: measurement.projectId,
      location: measurement.location,
      width: parseFloat(measurement.width),
      height: parseFloat(measurement.height),
      direction: measurement.direction || 'N/A',
      notes: measurement.notes || '',
      status: (measurement.status || 'pending').toLowerCase(),
      recorded_by: userId,
      updated_by: userId,
      updated_at: new Date().toISOString(),
      film_required: measurement.filmRequired !== false
    };
    
    // Validate fields against actual schema
    const availableColumns = await getAvailableColumns('measurements');
    
    // Filter out fields that don't exist in the database
    const validDbFields = Object.entries(dbFields)
      .filter(([key]) => availableColumns.includes(key))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
    
    console.log('Saving measurement with validated fields:', validDbFields);
    
    // Make sure we're not trying to insert an empty object
    if (Object.keys(validDbFields).length === 0) {
      throw new Error('No valid fields to save. Schema validation failed');
    }
    
    // Ensure required fields are present
    if (!validDbFields.project_id || !validDbFields.location) {
      throw new Error('Required fields (project_id, location) are missing or invalid');
    }
    
    // Insert or update based on whether id is provided
    if (measurement.id) {
      const { data, error } = await supabase
        .from('measurements')
        .update(validDbFields)
        .eq('id', measurement.id)
        .select();
        
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('measurements')
        .insert(validDbFields)
        .select();
        
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving measurement with validation:', error);
    throw error;
  }
};
