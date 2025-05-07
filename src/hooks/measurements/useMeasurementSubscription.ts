
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Measurement } from '@/types/measurement';
import { setupRealtime } from '@/utils/setupRealtime';

// Define options for measurement subscription
interface MeasurementSubscriptionOptions {
  projectId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Hook to handle measurement data with real-time subscription
 */
export function useMeasurementSubscription(options: MeasurementSubscriptionOptions = {}) {
  // State for measurements data
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  
  // State for subscription status
  const [subscriptionState, setSubscriptionState] = useState<'idle' | 'connected' | 'error'>('idle');
  
  // State for polling fallback
  const [isPolling, setIsPolling] = useState<boolean>(false);
  
  // State to track if initial data has been loaded
  const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false);
  
  /**
   * Fetch measurements data from Supabase
   */
  const fetchMeasurementsData = useCallback(async (): Promise<Measurement[]> => {
    try {
      let query = supabase.from('measurements').select('*');
      
      // Apply filters if provided
      if (options.projectId) {
        query = query.eq('project_id', options.projectId);
      }
      
      if (options.status) {
        query = query.eq('status', options.status);
      }
      
      if (options.startDate) {
        query = query.gte('measurement_date', options.startDate.toISOString());
      }
      
      if (options.endDate) {
        query = query.lte('measurement_date', options.endDate.toISOString());
      }
      
      // Fetch data
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching measurements:', error);
        throw error;
      }
      
      // Transform data to ensure types match Measurement interface
      if (data) {
        return data.map(item => ({
          ...item,
          id: item.id,
          projectId: item.project_id,
          measurementDate: item.measurement_date,
          projectName: item.projectName || '', // Provide default value
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          recordedBy: item.recorded_by || '',
          width: String(item.width || ''), // Convert to string to match Measurement type
          height: String(item.height || ''), // Convert to string to match Measurement type
          area: String(item.area || ''), // Convert to string to match Measurement type
          status: item.status || 'Pending'
        } as Measurement));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching measurements:', error);
      return [];
    }
  }, [options.projectId, options.status, options.startDate, options.endDate]);
  
  /**
   * Refresh data from Supabase
   */
  const refreshData = useCallback(async () => {
    try {
      const data = await fetchMeasurementsData();
      setMeasurements(data);
      setInitialDataLoaded(true);
      return data;
    } catch (error) {
      console.error('Error in refreshData:', error);
      return [];
    }
  }, [fetchMeasurementsData]);
  
  /**
   * Setup real-time subscription
   */
  const setupSubscription = useCallback(async () => {
    try {
      console.info('Setting up realtime for measurements table...');
      
      // Try to enable real-time for the table
      const isRealtimeEnabled = await setupRealtime();
      
      if (!isRealtimeEnabled) {
        throw new Error('Failed to enable realtime');
      }
      
      // Create subscription channel
      const channel = supabase
        .channel('measurements-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'measurements'
          },
          (payload) => {
            console.log('Realtime update received:', payload);
            
            // Handle the update based on the event type
            switch(payload.eventType) {
              case 'INSERT':
                setMeasurements(prev => [payload.new as Measurement, ...prev]);
                break;
                
              case 'UPDATE':
                setMeasurements(prev => 
                  prev.map(item => 
                    item.id === payload.new.id ? { ...item, ...payload.new as Partial<Measurement> } : item
                  )
                );
                break;
                
              case 'DELETE':
                setMeasurements(prev => 
                  prev.filter(item => item.id !== payload.old?.id)
                );
                break;
                
              default:
                break;
            }
          }
        )
        .subscribe();
      
      // Set subscription state to connected
      setSubscriptionState('connected');
      
      // Return cleanup function
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.warn('Error setting up realtime, falling back to polling:', error);
      setSubscriptionState('error');
      setupPolling();
      return () => {};
    }
  }, []);
  
  /**
   * Setup polling as fallback for real-time updates
   */
  const setupPolling = useCallback(() => {
    console.info('Starting polling fallback mechanism');
    setIsPolling(true);
    
    // Poll for updates every 30 seconds
    const intervalId = setInterval(() => {
      console.info('Polling for measurement updates...');
      refreshData();
    }, 30000);
    
    // Return cleanup function
    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [refreshData]);
  
  // Effect to load initial data and setup real-time or polling
  useEffect(() => {
    // Fetch initial data
    refreshData();
    
    // Setup real-time subscription
    const cleanup = setupSubscription();
    
    // Cleanup function
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [refreshData, setupSubscription]);
  
  // Return the hook API
  return {
    measurements,
    refreshData,
    subscriptionState,
    isPolling,
    initialDataLoaded
  };
}
