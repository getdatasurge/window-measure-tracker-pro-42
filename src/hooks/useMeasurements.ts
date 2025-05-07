
import { useState, useEffect, useCallback } from 'react';
import { Measurement } from '@/types/measurement';
import { fetchMeasurementsData } from '@/services/measurementService';
import { setupMeasurementsSubscription } from '@/services/realtimeService';
import { useMeasurementSubscription } from '@/hooks/useMeasurementSubscription';

interface MeasurementsQueryOptions {
  projectId?: string;
  date?: Date;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Hook to fetch measurements with optional filtering and real-time updates
 */
export const useMeasurements = (options: MeasurementsQueryOptions = {}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use the subscription hook for real-time updates
  const {
    measurements,
    refreshData,
    subscriptionState
  } = useMeasurementSubscription({
    projectId: options.projectId
  });
  
  // Fetch initial data on mount
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        await refreshData();
        setError(null);
      } catch (err) {
        console.error('Error in initial measurements fetch:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch measurements'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitial();
  }, [options.projectId, options.date, options.status, options.startDate, options.endDate, refreshData]);
  
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
    isLoading: loading,
    error,
    refetchMeasurements: refreshData,
    getMeasurementsByDate,
    getMeasurementsByStatus,
    subscriptionState
  };
};

// Re-export enableMeasurementsRealtime for backward compatibility
export { enableMeasurementsRealtime } from '@/services/realtimeService';
