
import { supabase } from '@/integrations/supabase/client';
import { setupRealtime } from '@/utils/setupRealtime';

// Track if subscription has been set up to prevent redundant setups
let subscriptionSetupComplete = false;
let activeChannel = null;

/**
 * Setup a real-time subscription for the measurements table
 */
export const setupMeasurementsSubscription = async (
  onUpdate: () => void
): Promise<{ channel: any; cleanup: () => void }> => {
  try {
    // If we already have an active subscription, return it
    if (subscriptionSetupComplete && activeChannel) {
      console.log("Reusing existing realtime subscription");
      return { 
        channel: activeChannel,
        cleanup: () => {
          if (activeChannel) {
            console.log("Cleaning up realtime subscription");
            supabase.removeChannel(activeChannel);
            activeChannel = null;
            subscriptionSetupComplete = false;
          }
        }
      };
    }
    
    console.log("Setting up new realtime subscription for measurements");
    
    // Enable realtime for the measurements table first (this only needs to happen once per session)
    const realtimeStatus = await setupRealtime();
    
    if (!realtimeStatus) {
      console.warn("Failed to enable realtime for measurements table");
      return { 
        channel: null,
        cleanup: () => {} 
      };
    }
    
    // Subscribe to changes
    const channel = supabase
      .channel('measurements_changes')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'measurements'
        }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          
          // Trigger callback when changes occur
          onUpdate();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });
    
    console.log('Realtime subscription established for measurements table');
    
    // Store the active channel for reuse
    activeChannel = channel;
    subscriptionSetupComplete = true;
    
    // Return the channel and cleanup function
    return {
      channel,
      cleanup: () => {
        if (channel) {
          console.log("Cleaning up realtime subscription");
          supabase.removeChannel(channel);
          activeChannel = null;
          subscriptionSetupComplete = false;
        }
      }
    };
  } catch (error) {
    console.error('Failed to set up realtime subscription:', error);
    return {
      channel: null,
      cleanup: () => {}
    };
  }
};

/**
 * Enable real-time on the measurements table in Supabase
 */
export const enableMeasurementsRealtime = async (): Promise<boolean> => {
  try {
    // Use the updated setupRealtime utility 
    const success = await setupRealtime();
    return success;
  } catch (error) {
    console.error('Failed to enable real-time:', error);
    return false;
  }
};
