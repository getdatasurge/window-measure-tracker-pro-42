
import { supabase } from '@/integrations/supabase/client';

/**
 * Setup realtime functionality for the measurements table
 * This needs to be called before subscribing to realtime updates
 */
export const setupRealtime = async (): Promise<boolean> => {
  try {
    console.log('Setting up realtime for measurements table...');
    
    // Call the Edge Function to enable realtime for the measurements table
    const { data, error } = await supabase.functions.invoke('enable-realtime', {
      body: {
        tableName: 'measurements'
      }
    });
    
    if (error) {
      console.error('Error setting up realtime:', error);
      return false;
    }
    
    console.log('Realtime setup result:', data);
    return true;
  } catch (err) {
    console.error('Failed to setup realtime:', err);
    return false;
  }
};
