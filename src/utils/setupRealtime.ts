
import { supabase } from '@/integrations/supabase/client';

/**
 * Set up realtime functionality for a table
 * 
 * @param tableName The name of the table to enable realtime for
 * @returns Promise<boolean> true if realtime was enabled, false if not
 */
export async function setupRealtime(tableName: string = 'measurements'): Promise<boolean> {
  try {
    console.log(`Setting up realtime for ${tableName} table`);
    
    // Check if the table exists first
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1);
      
      if (error) {
        console.error(`Error verifying table ${tableName} exists:`, error);
        return false;
      }
      
      console.log(`Verified table ${tableName} exists`);
    } catch (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    // Attempt to subscribe to the table to verify realtime is enabled
    try {
      const channel = supabase
        .channel(`${tableName}-test`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: tableName },
          (payload) => {
            console.log('Realtime test payload:', payload);
          }
        )
        .subscribe();
        
      await new Promise((resolve) => setTimeout(resolve, 500));
      supabase.removeChannel(channel);
      
      console.log(`Successfully set up realtime for ${tableName}`);
      return true;
    } catch (error) {
      console.error(`Error setting up realtime subscription for ${tableName}:`, error);
      return false;
    }
  } catch (error) {
    console.error(`Error in setupRealtime:`, error);
    return false;
  }
}
