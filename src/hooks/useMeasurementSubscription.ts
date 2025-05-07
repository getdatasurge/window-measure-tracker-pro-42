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

  const POLLING_INTERVAL = 15000;
  const MAX_RETRY_ATTEMPTS = 5;

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

      const formattedData = (data || []).map(item => formatMeasurement(item));
      setMeasurements(formattedData);
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

  const startPolling = useCallback(() => {
    console.log('Starting polling fallback mechanism');
    const intervalId = setInterval(async () => {
      console.log('Polling for measurement updates...');
      await fetchMeasurements();
    }, POLLING_INTERVAL);
    return intervalId;
  }, [fetchMeasurements]);

  const setupSubscription: (retryAttempt?: number) => Promise<any> = useCallback(
    async (retryAttempt = 0) => {
      try {
        const realtimeEnabled = await setupRealtime();

        if (!realtimeEnabled && retryAttempt < MAX_RETRY_ATTEMPTS) {
          console.log(`Failed to enable realtime, retrying (${retryAttempt + 1}/${MAX_RETRY_ATTEMPTS})...`);
          setTimeout(() => {
            void setupSubscription(retryAttempt + 1);
          }, 2000 * Math.pow(1.5, retryAttempt));
          return null;
        }

        if (!realtimeEnabled) {
          throw new Error('Could not enable realtime after multiple attempts');
        }

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
                const { data: newData, error } = await supabase
                  .from('measurements')
                  .select(`*, projects (name)`)
                  .eq('id', payload.new.id)
                  .single();

                if (error) throw error;

                const formattedMeasurement = formatMeasurement(newData);

                setMeasurements(prev => {
                  const exists = prev.some(m => m.id === formattedMeasurement.id);
                  return exists ? prev : [formattedMeasurement, ...prev];
                });

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
                const { data: updatedData, error } = await supabase
                  .from('measurements')
                  .select(`*, projects (name)`)
                  .eq('id', payload.new.id)
                  .single();

                if (error) throw error;

                const formattedMeasurement = formatMeasurement(updatedData);

                setMeasurements(prev =>
                  prev.map(m => {
                    if (m.id === formattedMeasurement.id) {
                      const localTime = new Date(m.updatedAt).getTime();
                      const serverTime = new Date(formattedMeasurement.updatedAt).getTime();
                      return serverTime >= localTime ? formattedMeasurement : m;
                    }
                    return m;
                  })
                );

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
              setMeasurements(prev => prev.filter(m => m.id !== deletedId));
              if (onDelete) onDelete(deletedId);
            }
          )
          .subscribe((status) => {
            console.log('Supabase real-time subscription status:', status);
            setSubscriptionState(prev => {
              const newState = {
                ...prev,
                isConnected: status === 'SUBSCRIBED',
                isPolling: status !== 'SUBSCRIBED'
              };

              if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
                toast({
                  title: "Real-time connection issue",
                  description: "Switching to polling updates. Will try to reconnect automatically.",
                  variant: "destructive"
                });

                if (retryAttempt < MAX_RETRY_ATTEMPTS) {
                  setTimeout(() => {
                    void setupSubscription(retryAttempt + 1);
                  }, 5000);
                }
              } else if (status === 'SUBSCRIBED' && prev.isPolling) {
                toast({
                  title: "Real-time connection restored",
                  description: "Now receiving live updates."
                });
              }

              return newState;
            });
          });

        return channel;
      } catch (error) {
        console.error('Failed to setup real-time subscription:', error);
        setSubscriptionState(current => ({
          ...current,
          lastError: error instanceof Error ? error : new Error('Unknown subscription error'),
          isConnected: false,
          isPolling: true
        }));
        startPolling();
        return null;
      }
    },
    [projectId, onInsert, onUpdate, onDelete, toast, startPolling]
  );

  useEffect(() => {
    let channel: any = null;
    let pollingInterval: ReturnType<typeof setInterval> | null = null;

    fetchMeasurements();

    setupSubscription().then((ch) => {
      channel = ch;
      if (!ch) {
        pollingInterval = startPolling();
      }
    });

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

  const mergeMeasurements = useCallback((localData: Measurement[], newData: Measurement[]) => {
    const existingMap = new Map(localData.map(m => [m.id, m]));

    newData.forEach(newItem => {
      const existing = existingMap.get(newItem.id);
      if (!existing || new Date(newItem.updatedAt).getTime() > new Date(existing.updatedAt).getTime()) {
        existingMap.set(newItem.id, newItem);
      }
    });

    return Array.from(existingMap.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, []);

  const refreshData = useCallback(async () => {
    const newData = await fetchMeasurements();
    if (!newData) return false;
    setMeasurements(prev => mergeMeasurements(prev, newData));
    return true;
  }, [fetchMeasurements, mergeMeasurements]);

  return {
    measurements,
    refreshData,
    subscriptionState
  };
};
