
import { supabaseClient } from './supabaseClient';
import { setupRealtime } from '@/utils/setupRealtime';

// Enable measurements realtime updates
export const enableMeasurementsRealtime = async () => {
  try {
    console.log('Setting up realtime for measurements');
    await setupRealtime('measurements');
    return true;
  } catch (error) {
    console.error('Error enabling realtime for measurements:', error);
    console.warn('Failed to enable realtime for measurements table');
    console.warn('Realtime setup may not be complete');
    return false;
  }
};

// Setup a subscription to a table
export const setupMeasurementsSubscription = () => {
  const channel = supabaseClient
    .channel('public:measurements')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'measurements' }, payload => {
      console.log('Realtime update received:', payload);
    })
    .subscribe();
    
  return channel;
};
