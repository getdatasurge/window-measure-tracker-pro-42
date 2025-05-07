
import { supabase } from '@/integrations/supabase/client';

// Track realtime setup status to avoid redundant calls
let realtimeSetupComplete = false;
let realtimeSetupPromise: Promise<boolean> | null = null;

/**
 * Sets up real-time subscriptions and ensures tables are properly
 * configured for real-time functionality.
 * This function is optimized to only run once per session.
 */
export const setupRealtime = async (): Promise<boolean> => {
  // Return early if setup was already completed in this session
  if (realtimeSetupComplete) {
    console.log('Realtime setup already completed for this session');
    return true;
  }
  
  // If setup is in progress, return the existing promise
  if (realtimeSetupPromise) {
    console.log('Realtime setup already in progress, reusing existing promise');
    return realtimeSetupPromise;
  }
  
  // Start a new setup process and store the promise
  realtimeSetupPromise = setupRealtimeInternal();
  return realtimeSetupPromise;
};

/**
 * Internal function that handles the actual setup
 */
const setupRealtimeInternal = async (): Promise<boolean> => {
  try {
    console.log('Setting up realtime functionality...');
    
    // Try to enable REPLICA IDENTITY FULL using the edge function
    const { data: replicaData, error: replicaError } = await supabase.functions.invoke('enable-realtime', {
      body: { 
        tableName: 'measurements',
        operation: 'replica-identity'
      }
    });
    
    if (replicaError) {
      console.warn('Could not set REPLICA IDENTITY:', replicaError.message);
    } else {
      console.log('Successfully set REPLICA IDENTITY FULL on measurements table');
    }
    
    // Add the table to the realtime publication using edge function
    const { data: pubData, error: pubError } = await supabase.functions.invoke('enable-realtime', {
      body: { 
        tableName: 'measurements',
        operation: 'add-publication'
      }
    });
    
    if (pubError) {
      console.warn('Could not update publication:', pubError.message);
    } else {
      console.log('Successfully added measurements to realtime publication');
    }
    
    // Mark setup as complete to avoid redundant calls
    if (!replicaError && !pubError) {
      realtimeSetupComplete = true;
    }
    
    // Clear the stored promise as setup is now complete
    realtimeSetupPromise = null;
    
    // Return success based on operation results
    return !replicaError && !pubError;
  } catch (error) {
    console.warn('Could not configure realtime with direct operations:', error);
    
    try {
      // Fall back to a function call with all operations
      const { data, error: fnError } = await supabase.functions.invoke('enable-realtime', {
        body: { tableName: 'measurements' }
      });
      
      if (fnError) {
        console.error('Failed to setup realtime via function:', fnError);
        realtimeSetupPromise = null;
        return false;
      }
      
      console.log('Realtime setup complete via function');
      realtimeSetupComplete = true;
      realtimeSetupPromise = null;
      return true;
    } catch (fnError) {
      console.error('Failed to setup realtime:', fnError);
      console.warn('Realtime setup may not be complete');
      realtimeSetupPromise = null;
      return false;
    }
  }
};

/**
 * Checks if realtime has been set up for the current session
 */
export const isRealtimeSetup = (): boolean => {
  return realtimeSetupComplete;
};
