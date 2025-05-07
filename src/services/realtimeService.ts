
import { supabaseClient } from './supabaseClient';
import { setupRealtime } from '@/utils/setupRealtime';

// Enable measurements realtime updates
export const enableMeasurementsRealtime = async () => {
  try {
    console.log('Setting up realtime for measurements');
    const result = await setupRealtime('measurements');
    return result;
  } catch (error) {
    console.error('Error enabling realtime for measurements:', error);
    console.warn('Failed to enable realtime for measurements table');
    console.warn('Realtime setup may not be complete');
    return false;
  }
};

// Setup subscription to measurements table
export const setupMeasurementsSubscription = () => {
  try {
    const channel = supabaseClient
      .channel('public:measurements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'measurements' }, payload => {
        console.log('Realtime update received:', payload);
      })
      .subscribe();
      
    return channel;
  } catch (error) {
    console.error('Error setting up measurements subscription:', error);
    return null;
  }
};
