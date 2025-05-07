
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
  
  // Function to fetch measurements with current options
  const fetchMeasurements = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const mappedMeasurements = await fetchMeasurementsData(options);
      
      setMeasurements(mappedMeasurements);
      setError(null);
      
      // Enable realtime subscriptions if not already set up
      if (!isRealtime) {
        setupRealtimeSubscription();
      }
    } catch (err) {
      console.error('Error fetching measurements:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch measurements'));
    } finally {
      setIsLoading(false);
    }
  }, [options, isRealtime]);
  
  // Fetch the measurements data on mount and when options change
  useEffect(() => {
    fetchMeasurements();
    
    // Cleanup function to remove subscriptions
    return () => {
      if (realtimeChannel) {
        realtimeChannel.cleanup();
        setRealtimeChannel(null);
        setIsRealtime(false);
      }
    };
  }, [options.projectId, options.date, options.status, fetchMeasurements]);
  
  // Set up realtime subscription
  const setupRealtimeSubscription = async () => {
    const { channel, cleanup } = await setupMeasurementsSubscription(fetchMeasurements);
    
    if (channel) {
      setRealtimeChannel({ channel, cleanup });
      setIsRealtime(true);
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
