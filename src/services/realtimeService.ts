
import { supabase } from '@/integrations/supabase/client';
import { setupRealtime, mockSetupRealtime } from '@/utils/setupRealtime';

// Track if subscription has been set up to prevent redundant setups
let subscriptionSetupComplete = false;
let activeChannel = null;
let isUsingPollingFallback = false;

/**
 * Setup a real-time subscription for the measurements table with fallback to polling
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
    
    // Try to enable realtime for the measurements table
    const realtimeStatus = await setupRealtime().catch(() => false);
    
    // If real-time setup fails, fall back to mock/polling
    if (!realtimeStatus) {
      console.warn("Failed to enable realtime for measurements table, using polling fallback");
      isUsingPollingFallback = true;
      
      // Set up polling mechanism
      const pollingInterval = setInterval(() => {
        console.log("Polling for measurement updates...");
        onUpdate();
      }, 30000); // Poll every 30 seconds
      
      return { 
        channel: null,
        cleanup: () => {
          clearInterval(pollingInterval);
          isUsingPollingFallback = false;
        }
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
        
        // If subscription fails, fall back to polling
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn("Realtime subscription error, falling back to polling");
          isUsingPollingFallback = true;
        } else if (status === 'SUBSCRIBED') {
          isUsingPollingFallback = false;
        }
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
    isUsingPollingFallback = true;
    
    // Set up polling fallback
    const pollingInterval = setInterval(() => {
      console.log("Polling for measurement updates due to realtime setup failure");
      onUpdate();
    }, 30000);
    
    return {
      channel: null,
      cleanup: () => {
        clearInterval(pollingInterval);
        isUsingPollingFallback = false;
      }
    };
  }
};

/**
 * Enable real-time on the measurements table in Supabase
 */
export const enableMeasurementsRealtime = async (): Promise<boolean> => {
  try {
    // First try the standard setup
    const success = await setupRealtime();
    
    // If it fails, try the mock/fallback approach
    if (!success) {
      console.log("Standard realtime setup failed, using mock implementation");
      return await mockSetupRealtime();
    }
    
    return success;
  } catch (error) {
    console.error('Failed to enable real-time:', error);
    return false;
  }
};

/**
 * Check if we're currently using polling fallback instead of realtime
 */
export const isUsingPollingFallbackMode = (): boolean => {
  return isUsingPollingFallback;
};
