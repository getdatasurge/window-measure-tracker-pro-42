
import { supabase } from '@/integrations/supabase/client';

/**
 * Sets up real-time subscriptions and ensures tables are properly
 * configured for real-time functionality
 */
export const setupRealtime = async () => {
  try {
    // Make sure the measurements table has REPLICA IDENTITY FULL
    await supabase.rpc('execute_sql', {
      sql: `ALTER TABLE public.measurements REPLICA IDENTITY FULL;`
    });
    
    // Add the table to the realtime publication if not already there
    await supabase.rpc('execute_sql', {
      sql: `ALTER PUBLICATION supabase_realtime ADD TABLE public.measurements;`
    });
    
    console.log('Realtime setup complete for measurements table');
    return true;
  } catch (error) {
    // This might fail if the user doesn't have admin privileges, but that's ok
    console.warn('Could not configure realtime with direct SQL:', error);
    
    try {
      // Fall back to a function call if available
      await supabase.functions.invoke('enable-realtime', {
        body: { tableName: 'measurements' }
      });
      console.log('Realtime setup complete via function');
      return true;
    } catch (fnError) {
      console.error('Failed to setup realtime:', fnError);
      return false;
    }
  }
};

export default setupRealtime;
