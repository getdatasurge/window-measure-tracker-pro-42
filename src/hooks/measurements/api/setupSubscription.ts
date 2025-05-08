
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Callback interface for subscription events
 */
export interface SubscriptionCallbacks {
  onInsert: (measurement: any) => void;
  onUpdate: (measurement: any) => void;
  onDelete: (id: string) => void;
}

/**
 * Setup real-time subscription for measurement table
 */
export async function setupMeasurementsSubscription(callbacks: SubscriptionCallbacks) {
  try {
    console.info('Setting up real-time subscription for measurements');
    
    // Create a channel for real-time updates
    const channel = supabase
      .channel('measurement_changes')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'measurements',
          filter: 'deleted=eq.false'
        },
        (payload) => {
          console.info('Measurement inserted:', payload.new);
          if (callbacks.onInsert) {
            callbacks.onInsert(payload.new);
          }
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'measurements',
          filter: 'deleted=eq.false'
        },
        (payload) => {
          console.info('Measurement updated:', payload.new);
          if (callbacks.onUpdate) {
            callbacks.onUpdate(payload.new);
          }
        }
      )
      .on('postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'measurements'
        },
        (payload) => {
          console.info('Measurement deleted:', payload.old.id);
          if (callbacks.onDelete) {
            callbacks.onDelete(payload.old.id);
          }
        }
      );
    
    // Subscribe to the channel
    const status = await channel.subscribe((status) => {
      console.info('Subscription status:', status);
    });
    
    // Fix the comparison by checking if status is not the expected value
    if (status !== 'SUBSCRIBED') {
      throw new Error(`Failed to subscribe to real-time channel: ${status}`);
    }
    
    // Return the channel for cleanup
    return channel;
  } catch (error) {
    console.error('Error setting up real-time subscription:', error);
    throw error;
  }
}
