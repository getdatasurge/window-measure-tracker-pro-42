
import { supabase } from '@/integrations/supabase/client';

/**
 * Sets up real-time subscriptions and ensures tables are properly
 * configured for real-time functionality
 */
export const setupRealtime = async () => {
  try {
    // Try to execute SQL directly to enable REPLICA IDENTITY FULL
    const { error: replicaError } = await supabase
      .from('_rpc')
      .select('*')
      .eq('name', 'execute_sql')
      .select()
      .maybeSingle()
      .execute({
        params: { 
          sql: `ALTER TABLE public.measurements REPLICA IDENTITY FULL;` 
        }
      });
    
    if (replicaError) {
      console.warn('Could not set REPLICA IDENTITY:', replicaError.message);
    } else {
      console.log('Successfully set REPLICA IDENTITY FULL on measurements table');
    }
    
    // Add the table to the realtime publication
    const { error: pubError } = await supabase
      .from('_rpc')
      .select('*')
      .eq('name', 'execute_sql')
      .select()
      .maybeSingle()
      .execute({
        params: { 
          sql: `ALTER PUBLICATION supabase_realtime ADD TABLE public.measurements;` 
        }
      });
    
    if (pubError) {
      console.warn('Could not update publication:', pubError.message);
    } else {
      console.log('Successfully added measurements to realtime publication');
    }
    
    // Fall back to a function call if available
    if (replicaError || pubError) {
      try {
        const { error: fnError } = await supabase.functions.invoke('enable-realtime', {
          body: { tableName: 'measurements' }
        });
        
        if (fnError) {
          console.error('Failed to setup realtime via function:', fnError.message);
          return false;
        }
        
        console.log('Realtime setup complete via function');
        return true;
      } catch (fnError) {
        console.error('Failed to setup realtime:', fnError);
        return false;
      }
    }
    
    console.log('Realtime setup complete for measurements table');
    return true;
  } catch (error) {
    // This might fail if the user doesn't have admin privileges, but that's ok
    console.warn('Could not configure realtime with direct SQL:', error);
    
    try {
      // Fall back to a function call if available
      const { error: fnError } = await supabase.functions.invoke('enable-realtime', {
        body: { tableName: 'measurements' }
      });
      
      if (fnError) {
        console.error('Failed to setup realtime via function:', fnError);
        return false;
      }
      
      console.log('Realtime setup complete via function');
      return true;
    } catch (fnError) {
      console.error('Failed to setup realtime:', fnError);
      return false;
    }
  }
};

export default setupRealtime;
