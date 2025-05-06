

import { Measurement } from '@/types/measurement';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

/**
 * Convert a fraction string (like '1/2' or '3 1/4') to decimal
 */
export const fractionToDecimal = (value: string): number => {
  // Handle empty values
  if (!value || value === '') return 0;

  // If it's already a number, just return it
  if (!isNaN(Number(value))) return Number(value);

  // Check for mixed number format (e.g., "3 1/2")
  const mixedMatch = value.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const numerator = parseInt(mixedMatch[2], 10);
    const denominator = parseInt(mixedMatch[3], 10);
    return whole + (numerator / denominator);
  }

  // Check for simple fraction format (e.g., "1/2")
  const fractionMatch = value.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const numerator = parseInt(fractionMatch[1], 10);
    const denominator = parseInt(fractionMatch[2], 10);
    return numerator / denominator;
  }

  // If no patterns match, try to parse as number
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Generate a new measurement with default values
 */
export const generateNewMeasurement = (defaultValues: Partial<Measurement> = {}): Measurement => {
  const now = new Date().toISOString();
  const datePart = now.split('T')[0];
  
  return {
    id: crypto.randomUUID(),
    projectId: defaultValues.projectId || '',
    projectName: defaultValues.projectName || 'Select Project',
    location: defaultValues.location || '',
    width: defaultValues.width || '0"',
    height: defaultValues.height || '0"',
    area: defaultValues.area || '0 ft²',
    quantity: defaultValues.quantity || 1,
    recordedBy: defaultValues.recordedBy || '',
    direction: defaultValues.direction || 'N/A',
    glassType: defaultValues.glassType || '',
    notes: defaultValues.notes || '',
    status: defaultValues.status || 'Pending',
    measurementDate: defaultValues.measurementDate || datePart,
    updatedAt: now,
    updatedBy: defaultValues.updatedBy || 'Current User',
  };
};

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
        glass_type,
        notes,
        status,
        measurement_date,
        updated_at,
        updated_by,
        projects (name)
      `)
      .gte('measurement_date', startDate.toISOString())
      .lt('measurement_date', endDate.toISOString())
      .order('measurement_date', { ascending: false });
      
    if (error) throw error;
    
    // Transform the data to match our Measurement type
    return (data || []).map(item => ({
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
      direction: item.direction || 'N/A',
      glassType: item.glass_type,
      notes: item.notes,
      status: item.status || 'Pending',
      measurementDate: item.measurement_date || new Date().toISOString(),
      updatedAt: item.updated_at || new Date().toISOString(),
      updatedBy: item.updated_by,
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
        glass_type,
        notes,
        status,
        measurement_date,
        updated_at,
        updated_by,
        projects (name)
      `)
      .eq('status', status.toLowerCase())
      .order('updated_at', { ascending: false });
      
    if (error) throw error;
    
    // Transform the data to match our Measurement type
    return (data || []).map(item => ({
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
      direction: item.direction || 'N/A',
      glassType: item.glass_type,
      notes: item.notes,
      status: item.status || 'Pending',
      measurementDate: item.measurement_date || new Date().toISOString(),
      updatedAt: item.updated_at || new Date().toISOString(),
      updatedBy: item.updated_by,
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
        glass_type,
        notes,
        status,
        measurement_date,
        updated_at,
        updated_by,
        projects (name)
      `)
      .order('updated_at', { ascending: false });
      
    if (error) throw error;
    
    // Transform the data to match our Measurement type
    return (data || []).map(item => ({
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
      direction: item.direction || 'N/A',
      glassType: item.glass_type,
      notes: item.notes,
      status: item.status || 'Pending',
      measurementDate: item.measurement_date || new Date().toISOString(),
      updatedAt: item.updated_at || new Date().toISOString(),
      updatedBy: item.updated_by,
    }));
  } catch (error) {
    console.error('Error fetching all measurements:', error);
    return [];
  }
};

export const formatTimeAgo = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (e) {
    return 'Unknown time';
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
