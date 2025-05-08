
import { supabase } from '@/integrations/supabase/client';
import { Measurement } from '@/types/measurement';
import { setupRealtime } from '@/utils/setupRealtime';
import { formatMeasurement } from '../utils/formatMeasurement';

export interface SubscriptionCallbacks {
  onInsert?: (measurement: Measurement) => void;
  onUpdate?: (measurement: Measurement) => void;
  onDelete?: (id: string) => void;
}

/**
 * Setup real-time subscription for measurements
 */
export async function setupMeasurementsSubscription(callbacks: SubscriptionCallbacks = {}) {
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
              const newMeasurement = formatMeasurement(payload.new);
              
              if (callbacks.onInsert) {
                callbacks.onInsert(newMeasurement);
              }
              
              break;
            }
              
            case 'UPDATE': {
              const updatedMeasurement = formatMeasurement(payload.new);
              
              if (callbacks.onUpdate) {
                callbacks.onUpdate(updatedMeasurement);
              }
              
              break;
            }
              
            case 'DELETE': {
              if (callbacks.onDelete && payload.old?.id) {
                callbacks.onDelete(payload.old.id);
              }
              
              break;
            }
              
            default:
              break;
          }
        }
      )
      .subscribe();
    
    // Return the channel for cleanup
    return channel;
  } catch (error) {
    console.warn('Error setting up realtime subscription:', error);
    throw error;
  }
}
