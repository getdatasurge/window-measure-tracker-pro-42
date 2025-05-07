
import { useState, useEffect, useCallback } from 'react';
import { Measurement } from '@/types/measurement';

// Simple options interface without complex types
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch measurements based on filters
  const fetchMeasurements = useCallback(async () => {
    try {
      setLoading(true);
      
      // Import the service dynamically to avoid circular dependencies
      const { fetchMeasurements, fetchMeasurementsByStatus, fetchMeasurementsForDay } = await import('@/utils/measurementDataService');
      
      let data: Measurement[] = [];
      
      // Apply filters if provided
      if (options.status) {
        data = await fetchMeasurementsByStatus(options.status);
      } else if (options.date) {
        data = await fetchMeasurementsForDay(options.date);
      } else if (options.startDate && options.endDate) {
        // This would need a custom implementation
        data = await fetchMeasurements();
        // Filter by date range client-side for now
        data = data.filter(m => {
          const date = new Date(m.measurementDate);
          return date >= options.startDate! && date <= options.endDate!;
        });
      } else if (options.projectId) {
        data = await fetchMeasurements();
        // Filter by projectId client-side
        data = data.filter(m => m.projectId === options.projectId);
      } else {
        data = await fetchMeasurements();
      }
      
      setMeasurements(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching measurements:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch measurements'));
      return [];
    } finally {
      setLoading(false);
    }
  }, [options.projectId, options.date, options.status, options.startDate, options.endDate]);
  
  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchMeasurements();
  }, [fetchMeasurements]);
  
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
    refetchMeasurements: fetchMeasurements,
    getMeasurementsByDate,
    getMeasurementsByStatus
  };
};

// Re-export for backward compatibility (avoid direct import)
export { enableMeasurementsRealtime } from '@/services/realtimeService';
