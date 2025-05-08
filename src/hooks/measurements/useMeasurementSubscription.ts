
import { useState, useEffect, useCallback } from 'react';
import { Measurement } from '@/types/measurement';
import { fetchMeasurementsData, MeasurementFetchOptions } from './api/fetchMeasurements';
import { setupMeasurementsSubscription, SubscriptionCallbacks } from './api/setupSubscription';
import { setupPolling } from './api/setupPolling';
import { MeasurementSubscriptionOptions, SubscriptionState } from './types/subscriptionTypes';

/**
 * Hook to handle measurement data with real-time subscription
 */
export function useMeasurementSubscription(options: MeasurementSubscriptionOptions = {}) {
  // State for measurements data
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  
  // State for subscription status
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
    lastError: null,
    isConnected: false,
    isPolling: false,
    lastSyncTime: null
  });
  
  /**
   * Refresh data from backend
   */
  const refreshData = useCallback(async () => {
    try {
      // Prepare fetch options
      const fetchOptions: MeasurementFetchOptions = {
        projectId: options.projectId,
        status: options.status,
        startDate: options.startDate,
        endDate: options.endDate
      };
      
      // Fetch the data
      const data = await fetchMeasurementsData(fetchOptions);
      setMeasurements(data);
      
      // Update subscription state
      setSubscriptionState(prev => ({
        ...prev,
        lastSyncTime: new Date(),
        lastError: null
      }));
      
      return true;
    } catch (error) {
      console.error('Error in refreshData:', error);
      setSubscriptionState(prev => ({
        ...prev,
        lastError: error instanceof Error ? error : new Error('Unknown fetch error')
      }));
      return false;
    }
  }, [options.projectId, options.status, options.startDate, options.endDate]);
  
  // Prepare subscription callbacks
  const subscriptionCallbacks: SubscriptionCallbacks = {
    onInsert: (measurement) => {
      if (options.onInsert) {
        options.onInsert(measurement);
      }
      setMeasurements(prev => [measurement, ...prev]);
    },
    onUpdate: (measurement) => {
      if (options.onUpdate) {
        options.onUpdate(measurement);
      }
      setMeasurements(prev => 
        prev.map(item => 
          item.id === measurement.id ? measurement : item
        )
      );
    },
    onDelete: (id) => {
      if (options.onDelete) {
        options.onDelete(id);
      }
      setMeasurements(prev => 
        prev.filter(item => item.id !== id)
      );
    }
  };
  
  // Setup subscription
  useEffect(() => {
    // Fetch initial data
    refreshData();
    
    // Setup mock real-time subscription
    let cleanup: (() => void) | undefined;
    
    const setupSubscription = async () => {
      try {
        // Try to set up mock subscription
        const cleanupFn = await setupMeasurementsSubscription(subscriptionCallbacks);
        
        // Update subscription state
        setSubscriptionState(prev => ({
          ...prev,
          isConnected: true,
          isPolling: false
        }));
        
        // Return cleanup function
        return cleanupFn;
      } catch (error) {
        console.warn('Error setting up mock realtime, falling back to polling:', error);
        
        // Update subscription state
        setSubscriptionState(prev => ({
          ...prev,
          isConnected: false,
          isPolling: true,
          lastError: error instanceof Error ? error : new Error('Unknown subscription error')
        }));
        
        // Set up polling fallback
        return setupPolling(refreshData);
      }
    };
    
    // Execute setup and store cleanup function
    setupSubscription().then(cleanupFn => {
      cleanup = cleanupFn;
    });
    
    // Return cleanup function
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [refreshData, subscriptionCallbacks]);
  
  // Return the hook API
  return {
    measurements,
    refreshData,
    subscriptionState,
    isPolling: subscriptionState.isPolling,
    initialDataLoaded: measurements.length > 0
  };
}

// Re-export types for backward compatibility
export type { SubscriptionState, MeasurementSubscriptionOptions };
