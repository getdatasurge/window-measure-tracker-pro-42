
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Measurement } from '@/types/measurement';
import { setupRealtime } from '@/utils/setupRealtime';
import { formatMeasurement } from '@/utils/formatters/measurementFormatter';

// Define options for measurement subscription
interface MeasurementSubscriptionOptions {
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
   * Fetch measurements data from Supabase
   */
  const fetchMeasurementsData = useCallback(async (): Promise<Measurement[]> => {
    try {
      let query = supabase.from('measurements').select(`
        *,
        projects (name)
      `);
      
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
        return data.map(item => {
          // Get the project name from the nested projects object
          const projectName = item.projects ? item.projects.name : '';
          
          // Convert numeric fields to strings to match the Measurement interface
          return {
            id: item.id,
            projectId: item.project_id,
            measurementDate: item.measurement_date,
            projectName: projectName || '',
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            recordedBy: item.recorded_by || '',
            width: String(item.width || ''), // Convert to string
            height: String(item.height || ''), // Convert to string
            area: String(item.area || ''), // Convert to string
            status: item.status || 'Pending',
            location: item.location || '',
            direction: item.direction || 'N/A',
            notes: item.notes || '',
            quantity: item.quantity || 1,
            film_required: item.film_required,
            installationDate: item.installation_date,
            photos: Array.isArray(item.photos) ? item.photos : [] // Ensure photos is always an array
          } as Measurement;
        });
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
  }, [fetchMeasurementsData]);
  
  /**
   * Setup polling as fallback for real-time updates
   * This function actually returns the cleanup function
   */
  const setupPolling = useCallback(() => {
    console.info('Starting polling fallback mechanism');
    
    // Poll for updates every 30 seconds
    const intervalId = setInterval(() => {
      console.info('Polling for measurement updates...');
      refreshData();
    }, 30000);
    
    // Return cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }, [refreshData]);
  
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
              case 'INSERT': {
                if (options.onInsert && payload.new) {
                  const newMeasurement = formatMeasurement(payload.new);
                  options.onInsert(newMeasurement);
                }
                setMeasurements(prev => [formatMeasurement(payload.new), ...prev]);
                break;
              }
                
              case 'UPDATE': {
                if (options.onUpdate && payload.new) {
                  const updatedMeasurement = formatMeasurement(payload.new);
                  options.onUpdate(updatedMeasurement);
                }
                setMeasurements(prev => 
                  prev.map(item => 
                    item.id === payload.new.id ? formatMeasurement(payload.new) : item
                  )
                );
                break;
              }
                
              case 'DELETE': {
                if (options.onDelete && payload.old?.id) {
                  options.onDelete(payload.old.id);
                }
                setMeasurements(prev => 
                  prev.filter(item => item.id !== payload.old?.id)
                );
                break;
              }
                
              default:
                break;
            }
          }
        )
        .subscribe();
      
      // Set subscription state to connected
      setSubscriptionState(prev => ({
        ...prev,
        isConnected: true,
        isPolling: false
      }));
      
      // Return cleanup function
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.warn('Error setting up realtime, falling back to polling:', error);
      setSubscriptionState(prev => ({
        ...prev,
        isConnected: false,
        isPolling: true,
        lastError: error instanceof Error ? error : new Error('Unknown subscription error')
      }));
      
      // Return the cleanup function from setupPolling
      return setupPolling();
    }
  }, [options.onInsert, options.onUpdate, options.onDelete, setupPolling]);
  
  // Effect to load initial data and setup real-time or polling
  useEffect(() => {
    // Fetch initial data
    refreshData();
    
    // Setup real-time subscription
    const cleanupSubscription = setupSubscription();
    
    // Cleanup function
    return () => {
      if (typeof cleanupSubscription === 'function') {
        cleanupSubscription();
      } else if (cleanupSubscription instanceof Promise) {
        // Handle the promise case
        cleanupSubscription.then(cleanup => {
          if (typeof cleanup === 'function') {
            cleanup();
          }
        }).catch(err => {
          console.error('Error cleaning up subscription:', err);
        });
      }
    };
  }, [refreshData, setupSubscription]);
  
  // Return the hook API
  return {
    measurements,
    refreshData,
    subscriptionState,
    isPolling: subscriptionState.isPolling,
    initialDataLoaded: measurements.length > 0
  };
}
