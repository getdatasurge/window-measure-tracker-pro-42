
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Measurement } from '@/types/measurement';
import { setupRealtime } from '@/utils/setupRealtime';
import { formatMeasurement } from '@/utils/formatters/measurementFormatter';

interface UseMeasurementSubscriptionProps {
  initialData?: Measurement[];
  projectId?: string;
  onInsert?: (measurement: Measurement) => void;
  onUpdate?: (measurement: Measurement) => void;
  onDelete?: (id: string) => void;
}

interface SubscriptionState {
  lastError: Error | null;
  isConnected: boolean;
  isPolling: boolean;
  lastSyncTime: Date | null;
}

/**
 * Hook to subscribe to real-time measurement updates with fallback polling
 */
export const useMeasurementSubscription = ({
  initialData = [],
  projectId,
  onInsert,
  onUpdate,
  onDelete
}: UseMeasurementSubscriptionProps) => {
  const [measurements, setMeasurements] = useState<Measurement[]>(initialData);
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
    lastError: null,
    isConnected: false,
    isPolling: false,
    lastSyncTime: null
  });
  const { toast } = useToast();
  
  // Polling interval (in milliseconds) for fallback mechanism
  const POLLING_INTERVAL = 15000; // 15 seconds
  
  // Maximum retry attempts for reconnection
  const MAX_RETRY_ATTEMPTS = 5;
  
  // Fetch measurements with query filters
  const fetchMeasurements = useCallback(async () => {
    try {
      let query = supabase
        .from('measurements')
        .select(`
          id,
          project_id,
          location,
          width, 
          height, 
          depth, 
          area, 
          quantity,
          recorded_by,
          direction,
          notes,
          status,
          measurement_date,
          updated_at,
          updated_by,
          photos,
          film_required,
          input_source,
          projects (name)
        `)
        .eq('deleted', false)
        .order('updated_at', { ascending: false });
        
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match our Measurement type
      const formattedData = (data || []).map((item) => formatMeasurement(item));
      
      // Update local state
      setMeasurements(formattedData);
      
      // Update subscription state
      setSubscriptionState(prev => ({
        ...prev,
        lastSyncTime: new Date(),
        lastError: null
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching measurements:', error);
      setSubscriptionState(prev => ({
        ...prev,
        lastError: error instanceof Error ? error : new Error('Unknown fetch error')
      }));
      return null;
    }
  }, [projectId]);
  
  // Setup realtime subscription with retry logic
  const setupSubscription = useCallback(async (retryAttempt = 0) => {
    try {
      // First enable realtime functionality for the table
      const realtimeEnabled = await setupRealtime();
      
      if (!realtimeEnabled && retryAttempt < MAX_RETRY_ATTEMPTS) {
        console.warn(`Failed to enable realtime, retrying (${retryAttempt + 1}/${MAX_RETRY_ATTEMPTS})...`);
        setTimeout(() => setupSubscription(retryAttempt + 1), 2000 * Math.pow(1.5, retryAttempt));
        return null;
      }
      
      if (!realtimeEnabled) {
        throw new Error('Could not enable realtime after multiple attempts');
      }
      
      // Create the subscription channel
      const channel = supabase
        .channel('measurements_changes')
        .on('postgres_changes', 
          {
            event: 'INSERT', 
            schema: 'public',
            table: 'measurements',
            ...(projectId ? { filter: `project_id=eq.${projectId}` } : {})
          }, 
          async (payload) => {
            console.log('INSERT event received:', payload);
            try {
              // Get the complete record from the database to ensure we have all related data
              const { data: newData, error } = await supabase
                .from('measurements')
                .select(`*, projects (name)`)
                .eq('id', payload.new.id)
                .single();
                
              if (error) throw error;
              
              const formattedMeasurement = formatMeasurement(newData);
              
              // Update local state
              setMeasurements(prev => {
                // Check if the item already exists (duplicate insert)
                const exists = prev.some(m => m.id === formattedMeasurement.id);
                if (exists) return prev;
                return [formattedMeasurement, ...prev];
              });
              
              // Call the onInsert handler if provided
              if (onInsert) onInsert(formattedMeasurement);
            } catch (error) {
              console.error('Error processing INSERT event:', error);
            }
          }
        )
        .on('postgres_changes', 
          {
            event: 'UPDATE', 
            schema: 'public',
            table: 'measurements',
            ...(projectId ? { filter: `project_id=eq.${projectId}` } : {})
          }, 
          async (payload) => {
            console.log('UPDATE event received:', payload);
            try {
              // Get the complete record from the database to ensure we have all related data
              const { data: updatedData, error } = await supabase
                .from('measurements')
                .select(`*, projects (name)`)
                .eq('id', payload.new.id)
                .single();
                
              if (error) throw error;
              
              const formattedMeasurement = formatMeasurement(updatedData);
              
              // Conflict resolution logic - prefer server data but preserve local changes not yet synced
              setMeasurements(prev => {
                return prev.map(m => {
                  // If this is the updated measurement
                  if (m.id === formattedMeasurement.id) {
                    // Check timestamps for conflict resolution
                    const localUpdatedAt = new Date(m.updatedAt).getTime();
                    const serverUpdatedAt = new Date(formattedMeasurement.updatedAt).getTime();
                    
                    // If server data is newer, use it
                    if (serverUpdatedAt >= localUpdatedAt) {
                      return formattedMeasurement;
                    } else {
                      console.warn('Local data more recent than server update, keeping local version');
                      // Local data is more recent - potential conflict
                      return m;
                    }
                  }
                  return m;
                });
              });
              
              // Call the onUpdate handler if provided
              if (onUpdate) onUpdate(formattedMeasurement);
            } catch (error) {
              console.error('Error processing UPDATE event:', error);
            }
          }
        )
        .on('postgres_changes', 
          {
            event: 'DELETE', 
            schema: 'public',
            table: 'measurements',
            ...(projectId ? { filter: `project_id=eq.${projectId}` } : {})
          }, 
          (payload) => {
            console.log('DELETE event received:', payload);
            
            const deletedId = payload.old.id;
            
            // Update local state
            setMeasurements(prev => prev.filter(m => m.id !== deletedId));
            
            // Call the onDelete handler if provided
            if (onDelete) onDelete(deletedId);
          }
        )
        .subscribe((status) => {
          console.log('Supabase real-time subscription status:', status);
          
          // Update connection state based on status
          setSubscriptionState(prev => ({
            ...prev,
            isConnected: status === 'SUBSCRIBED',
            isPolling: status !== 'SUBSCRIBED'
          }));
          
          // Show toast for connection issues
          if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
            toast({
              title: "Real-time connection issue",
              description: "Switching to polling updates. Will try to reconnect automatically.",
              variant: "destructive",
            });
            
            // Try to reconnect after a delay
            if (retryAttempt < MAX_RETRY_ATTEMPTS) {
              setTimeout(() => setupSubscription(retryAttempt + 1), 5000);
            }
          } else if (status === 'SUBSCRIBED' && prev.isPolling) {
            toast({
              title: "Real-time connection restored",
              description: "Now receiving live updates.",
            });
          }
        });
      
      return channel;
    } catch (error) {
      console.error('Failed to setup real-time subscription:', error);
      
      setSubscriptionState(prev => ({
        ...prev,
        lastError: error instanceof Error ? error : new Error('Unknown subscription error'),
        isConnected: false,
        isPolling: true
      }));
      
      // Fall back to polling
      startPolling();
      
      return null;
    }
  }, [projectId, onInsert, onUpdate, onDelete, toast]);
  
  // Start polling as fallback mechanism
  const startPolling = useCallback(() => {
    console.log('Starting polling fallback mechanism');
    
    const intervalId = setInterval(async () => {
      console.log('Polling for measurement updates...');
      await fetchMeasurements();
    }, POLLING_INTERVAL);
    
    return intervalId;
  }, [fetchMeasurements]);
  
  // Set up subscription and polling
  useEffect(() => {
    let channel: any = null;
    let pollingInterval: number | null = null;
    
    // Initial data fetch
    fetchMeasurements();
    
    // Setup real-time subscription
    setupSubscription().then((ch) => {
      channel = ch;
      
      // If subscription failed, start polling
      if (!ch) {
        pollingInterval = startPolling();
      }
    });
    
    // Cleanup on unmount
    return () => {
      if (channel) {
        console.log('Cleaning up real-time subscription');
        supabase.removeChannel(channel);
      }
      
      if (pollingInterval) {
        console.log('Stopping polling interval');
        clearInterval(pollingInterval);
      }
    };
  }, [projectId, fetchMeasurements, setupSubscription, startPolling]);
  
  // Merge with newly fetched data ensuring correct sorting and deduplication
  const mergeMeasurements = useCallback((localData: Measurement[], newData: Measurement[]) => {
    // Create a map of existing measurements by ID
    const existingMap = new Map(localData.map(m => [m.id, m]));
    
    // Merge with new data, preferring newer timestamps
    newData.forEach(newItem => {
      const existing = existingMap.get(newItem.id);
      
      if (!existing) {
        // Add new item if it doesn't exist
        existingMap.set(newItem.id, newItem);
      } else {
        // Compare timestamps for existing items
        const existingTime = new Date(existing.updatedAt).getTime();
        const newTime = new Date(newItem.updatedAt).getTime();
        
        // Update if new data is more recent
        if (newTime > existingTime) {
          existingMap.set(newItem.id, newItem);
        }
      }
    });
    
    // Convert map back to array and sort by updated_at
    return Array.from(existingMap.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, []);
  
  // Manual refresh function for the consumer to use
  const refreshData = useCallback(async () => {
    const newData = await fetchMeasurements();
    if (!newData) return false;
    
    // Merge into existing data
    setMeasurements(prev => mergeMeasurements(prev, newData));
    return true;
  }, [fetchMeasurements, mergeMeasurements]);
  
  return {
    measurements,
    refreshData,
    subscriptionState
  };
};
