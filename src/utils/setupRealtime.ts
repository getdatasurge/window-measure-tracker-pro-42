
import { supabase } from '@/integrations/supabase/client';

/**
 * Setup realtime functionality for the measurements table
 * This needs to be called before subscribing to realtime updates
 */
export const setupRealtime = async (): Promise<boolean> => {
  try {
    console.log('Setting up realtime for measurements table...');
    
    // First, check if the table exists to avoid errors
    const { data, error } = await supabase
      .from('measurements')
      .select('id')
      .limit(1);
    
    // If there's an error or no data, the table might not exist yet
    if (error) {
      console.log('Error checking measurements table:', error.message);
      return false;
    }
    
    const tableExists = Array.isArray(data) && data.length >= 0;
    
    if (!tableExists) {
      console.log('Measurements table does not exist yet - skipping realtime setup');
      return false;
    }
    
    // Call the Edge Function to enable realtime for the measurements table
    const { data: funcData, error: funcError } = await supabase.functions.invoke('enable-realtime', {
      body: {
        tableName: 'measurements'
      }
    });
    
    if (funcError) {
      console.warn('Error setting up realtime, falling back to polling:', funcError);
      return false;
    }
    
    console.log('Realtime setup result:', funcData);
    return true;
  } catch (err) {
    console.error('Failed to setup realtime, will use polling instead:', err);
    return false;
  }
};

// Add a local mock implementation that always returns success
// This helps during development when the edge function may not be available
export const mockSetupRealtime = async (): Promise<boolean> => {
  console.log('[MOCK] Setting up realtime for measurements table...');
  return true;
};
