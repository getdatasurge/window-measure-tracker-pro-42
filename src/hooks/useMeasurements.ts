
import { useState, useEffect, useCallback } from 'react';
import { Measurement } from '@/types/measurement';
import { fetchMeasurementsData } from '@/services/measurementService';
import { setupMeasurementsSubscription } from '@/services/realtimeService';

interface MeasurementsQueryOptions {
  projectId?: string;
  date?: Date;
  status?: string;
}

/**
 * Hook to fetch measurements with optional filtering
 */
export const useMeasurements = (options: MeasurementsQueryOptions = {}) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRealtime, setIsRealtime] = useState<boolean>(false);
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);
  const [isSetupInProgress, setIsSetupInProgress] = useState<boolean>(false);
  
  // Function to fetch measurements with current options
  const fetchMeasurements = useCallback(async () => {
    // If a fetch is already in progress, don't start another one
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      const mappedMeasurements = await fetchMeasurementsData(options);
      
      setMeasurements(mappedMeasurements);
      setError(null);
      
      // Setup realtime only if not already set up and not in progress
      if (!isRealtime && !isSetupInProgress) {
        setupRealtimeSubscription();
      }
    } catch (err) {
      console.error('Error fetching measurements:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch measurements'));
    } finally {
      setIsLoading(false);
    }
  }, [options, isRealtime, isSetupInProgress, isLoading]);
  
  // Fetch the measurements data on mount and when options change
  useEffect(() => {
    setIsLoading(true); // Reset loading state on dependency changes
    fetchMeasurements();
    
    // Cleanup function to remove subscriptions
    return () => {
      if (realtimeChannel) {
        realtimeChannel.cleanup();
        setRealtimeChannel(null);
        setIsRealtime(false);
      }
    };
  }, [options.projectId, options.date, options.status]);
  
  // Set up realtime subscription
  const setupRealtimeSubscription = async () => {
    if (isSetupInProgress) return;
    
    setIsSetupInProgress(true);
    try {
      const { channel, cleanup } = await setupMeasurementsSubscription(() => {
        // Debounce refetch to prevent rapid consecutive calls
        console.log("Realtime update received, scheduling refetch");
        setTimeout(fetchMeasurements, 300);
      });
      
      if (channel) {
        setRealtimeChannel({ channel, cleanup });
        setIsRealtime(true);
      }
    } finally {
      setIsSetupInProgress(false);
    }
  };
  
  // Expose refetchMeasurements for manual data refreshing
  const refetchMeasurements = async () => {
    console.log("Manually refetching measurements");
    return fetchMeasurements();
  };
  
  return {
    measurements,
    isLoading,
    error,
    refetchMeasurements
  };
};

// Re-export enableMeasurementsRealtime for backward compatibility
export { enableMeasurementsRealtime } from '@/services/realtimeService';
