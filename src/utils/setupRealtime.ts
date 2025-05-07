
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Define the function to enable realtime on a specific table
export async function enableRealtimeForTable(tableName: string, operation?: string) {
  try {
    console.log(`Setting up realtime for ${tableName}${operation ? ` (${operation})` : ''}`);
    
    const payload = {
      tableName,
      ...(operation && { operation })
    };
    
    // Call the Supabase edge function
    const { data, error } = await supabase.functions.invoke('enable-realtime', {
      body: JSON.stringify(payload)
    });
    
    if (error) {
      console.error(`Error enabling realtime for ${tableName}:`, error);
      return false;
    }
    
    console.log(`Realtime setup for ${tableName} completed:`, data);
    return true;
  } catch (err) {
    console.error(`Exception enabling realtime for ${tableName}:`, err);
    return false;
  }
}

// Function to setup all required realtime connections
export async function setupRealtime() {
  try {
    // Enable realtime for the measurements table
    const success = await enableRealtimeForTable('measurements');
    
    if (!success) {
      console.warn('Failed to enable realtime for measurements table');
      // Don't show error toasts to users during page load as it's confusing
      // But we should log it to console
    }
    
    // Additional tables can be added here
    
    return success;
  } catch (error) {
    console.error('Error setting up realtime:', error);
    return false;
  }
}

// Re-export the function for backward compatibility
export { setupRealtime as enableMeasurementsRealtime };
