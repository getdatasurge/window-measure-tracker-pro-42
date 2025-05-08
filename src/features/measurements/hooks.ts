
/**
 * Measurement hooks for managing measurement data
 */

import { useState, useCallback, useEffect } from 'react';
import { Measurement } from './types';
import { useOfflineCache } from '../../hooks/useOfflineCache';
import { useSyncQueue } from '../../hooks/useSyncQueue';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export interface MeasurementSubscriptionOptions {
  projectId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  onInsert?: (measurement: Measurement) => void;
  onUpdate?: (measurement: Measurement) => void;
  onDelete?: (id: string) => void;
}

export interface SubscriptionState {
  lastError: Error | null;
  isConnected: boolean;
  isPolling: boolean;
  lastSyncTime: Date | null;
}

/**
 * Hook for managing measurements with offline support
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

  const { isOnline } = useOnlineStatus();
  const measurementsCache = useOfflineCache<Measurement>('measurements');
  
  // Simulated measurement data for offline/demo mode
  const getSimulatedMeasurements = useCallback((): Measurement[] => {
    return [
      {
        id: 'demo-1',
        projectId: options.projectId || 'public-project',
        projectName: 'Demo Project',
        location: 'Living Room Window',
        width: '36',
        height: '48',
        area: '12', // Making sure area is not optional to match the type
        quantity: 1,
        recordedBy: 'demo-user',
        direction: 'N',
        notes: 'Demo measurement',
        status: 'Pending',
        updatedAt: new Date().toISOString(),
        updatedBy: 'Demo User',
        measurementDate: new Date().toISOString()
      },
      {
        id: 'demo-2',
        projectId: options.projectId || 'public-project',
        projectName: 'Demo Project',
        location: 'Kitchen Window',
        width: '24',
        height: '36',
        area: '6', // Making sure area is not optional to match the type
        quantity: 2,
        recordedBy: 'demo-user',
        direction: 'S',
        notes: 'Special film required',
        film_required: true,
        status: 'Ready',
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        updatedBy: 'Demo User',
        measurementDate: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }, [options.projectId]);
  
  // Fetch measurements with offline support
  const fetchMeasurementsData = useCallback(async (): Promise<Measurement[]> => {
    try {
      // First try to get from cache
      const cachedMeasurements = await measurementsCache.getAllItems();
      
      if (cachedMeasurements.length > 0) {
        return cachedMeasurements;
      }
      
      // If offline and no cache, use simulated data
      if (!isOnline) {
        const demoMeasurements = getSimulatedMeasurements();
        
        // Store in cache
        for (const measurement of demoMeasurements) {
          await measurementsCache.setItem(measurement.id, measurement);
        }
        
        return demoMeasurements;
      }
      
      // In demo mode, always return simulated data
      const measurements = getSimulatedMeasurements();
      
      // Store in cache
      for (const measurement of measurements) {
        await measurementsCache.setItem(measurement.id, measurement);
      }
      
      return measurements;
    } catch (error) {
      console.error('Error fetching measurements:', error);
      return getSimulatedMeasurements();
    }
  }, [isOnline, measurementsCache, getSimulatedMeasurements]);
  
  // Refresh data
  const refreshData = useCallback(async (): Promise<boolean> => {
    try {
      const data = await fetchMeasurementsData();
      setMeasurements(data);
      setSubscriptionState(prev => ({
        ...prev,
        lastSyncTime: new Date(),
        lastError: null
      }));
      return true;
    } catch (error) {
      console.error('Error refreshing measurement data:', error);
      setSubscriptionState(prev => ({
        ...prev,
        lastError: error instanceof Error ? error : new Error('Failed to refresh measurements')
      }));
      return false;
    }
  }, [fetchMeasurementsData]);
  
  // Simulated realtime polling
  useEffect(() => {
    // Initial fetch
    refreshData();
    
    // Set up periodic refresh for simulated realtime
    const intervalId = setInterval(() => {
      console.info('Simulating realtime check for measurements');
      refreshData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [refreshData]);
  
  return {
    measurements,
    refreshData,
    subscriptionState,
    isPolling: true, // Always in polling mode for demo
    initialDataLoaded: measurements.length > 0
  };
}
