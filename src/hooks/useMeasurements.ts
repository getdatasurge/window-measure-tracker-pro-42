
/**
 * Enable real-time on the measurements table in Supabase
 */
export const enableMeasurementsRealtime = async () => {
  try {
    // Use the updated setupRealtime utility 
    const success = await setupRealtime();
    return success;
  } catch (error) {
    console.error('Failed to enable real-time:', error);
    return false;
  }
};
