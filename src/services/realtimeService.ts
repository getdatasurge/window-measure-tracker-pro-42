
import { setupRealtime, mockSetupRealtime } from '@/utils/setupRealtime';

// Track if subscription has been set up to prevent redundant setups
let subscriptionSetupComplete = false;
let isUsingPollingFallback = false;

/**
 * Setup a real-time subscription with fallback to polling
 * (Supabase has been removed from this project)
 */
export const setupMeasurementsSubscription = async (
  onUpdate: () => void
): Promise<{ channel: any; cleanup: () => void }> => {
  try {
    // If we already have an active subscription, return it
    if (subscriptionSetupComplete) {
      console.log("Reusing existing mock subscription");
      return { 
        channel: null,
        cleanup: () => {
          console.log("Cleaning up mock subscription");
          subscriptionSetupComplete = false;
        }
      };
    }
    
    console.log("Setting up new mock subscription for measurements");
    
    // Try to enable mock realtime
    const realtimeStatus = await setupRealtime().catch(() => false);
    
    // If real-time setup fails, fall back to mock/polling
    if (!realtimeStatus) {
      console.warn("Failed to enable mock realtime, using polling fallback");
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
    
    console.log('Mock subscription established');
    
    // Store the flag for reuse
    subscriptionSetupComplete = true;
    
    // Return dummy channel and cleanup function
    return {
      channel: null,
      cleanup: () => {
        console.log("Cleaning up mock subscription");
        subscriptionSetupComplete = false;
      }
    };
  } catch (error) {
    console.error('Failed to set up mock subscription:', error);
    isUsingPollingFallback = true;
    
    // Set up polling fallback
    const pollingInterval = setInterval(() => {
      console.log("Polling for measurement updates due to setup failure");
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
 * Enable mock real-time functionality
 */
export const enableMeasurementsRealtime = async (): Promise<boolean> => {
  try {
    // First try the standard setup
    const success = await setupRealtime();
    
    // If it fails, try the fallback approach
    if (!success) {
      console.log("Standard mock setup failed, using fallback implementation");
      return await mockSetupRealtime();
    }
    
    return success;
  } catch (error) {
    console.error('Failed to enable mock real-time:', error);
    return false;
  }
};

/**
 * Check if we're currently using polling fallback
 */
export const isUsingPollingFallbackMode = (): boolean => {
  return isUsingPollingFallback;
};
