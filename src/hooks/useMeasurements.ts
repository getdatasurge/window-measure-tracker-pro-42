
import { useState, useEffect, useCallback } from 'react';
import { Measurement } from '@/types/measurement';
import { fetchMeasurementsData } from '@/services/measurementService';
import { setupMeasurementsSubscription } from '@/services/realtimeService';

interface MeasurementsQueryOptions {
  projectId?: string;
  date?: Date;
  status?: string;
  startDate?: Date;
  endDate?: Date;
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
  const fetchMeasurements = useCallback(async (forceRefresh = false) => {
    // If a fetch is already in progress and not forced, don't start another one
    if (isLoading && !forceRefresh) return;
    
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
  }, [options.projectId, options.date, options.status, options.startDate, options.endDate]);
  
  // Set up realtime subscription
  const setupRealtimeSubscription = async () => {
    if (isSetupInProgress) return;
    
    setIsSetupInProgress(true);
    try {
      const { channel, cleanup } = await setupMeasurementsSubscription(() => {
        // Debounce refetch to prevent rapid consecutive calls
        console.log("Realtime update received, scheduling refetch");
        setTimeout(() => fetchMeasurements(true), 300);
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
    return fetchMeasurements(true);
  };
  
  // Get measurements grouped by date
  const getMeasurementsByDate = useCallback((date: Date) => {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    return measurements.filter(m => {
      const measurementDate = new Date(m.measurementDate);
      return measurementDate >= startDate && measurementDate <= endDate;
    });
  }, [measurements]);
  
  // Get measurements by status
  const getMeasurementsByStatus = useCallback((status: string | string[]) => {
    if (Array.isArray(status)) {
      return measurements.filter(m => 
        status.some(s => m.status.toLowerCase() === s.toLowerCase())
      );
    }
    
    return measurements.filter(m => 
      m.status.toLowerCase() === status.toLowerCase()
    );
  }, [measurements]);
  
  return {
    measurements,
    isLoading,
    error,
    refetchMeasurements,
    getMeasurementsByDate,
    getMeasurementsByStatus
  };
};

// Re-export enableMeasurementsRealtime for backward compatibility
export { enableMeasurementsRealtime } from '@/services/realtimeService';
