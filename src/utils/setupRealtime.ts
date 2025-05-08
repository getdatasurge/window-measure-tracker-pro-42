
import { supabase } from '@/integrations/supabase/client';

/**
 * Set up realtime subscriptions for the app
 * This version works without authentication requirements
 */
export async function setupRealtime(): Promise<boolean> {
  try {
    // Basic channel test to see if realtime is working
    const channel = supabase.channel('system');
    
    // Listen for system broadcast messages
    channel
      .on('broadcast', { event: 'system-wide' }, (payload) => {
        console.log('System broadcast received:', payload);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Realtime connection established');
          return true;
        }
        
        if (status === 'CHANNEL_ERROR') {
          console.error('Failed to establish realtime connection');
          return false;
        }
        
        if (status === 'TIMED_OUT') {
          console.warn('Realtime connection timed out');
          return false;
        }
      });
      
    // Additional channel for measurements
    const measurementsChannel = supabase
      .channel('public:measurements')
      .subscribe();
      
    console.log('Measurement channel subscription status:', measurementsChannel);
    
    return true;
  } catch (error) {
    console.error('Error setting up realtime:', error);
    return false;
  }
}
