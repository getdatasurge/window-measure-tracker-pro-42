
/**
 * Sets up polling for data updates
 */
export function setupPolling(
  refreshFunction: () => Promise<boolean>,
  interval: number = 30000 // Default to 30 seconds
): () => void {
  console.log('Setting up polling with interval:', interval);
  
  // Start polling
  const timerId = setInterval(() => {
    console.log('Polling for updates...');
    refreshFunction().catch(err => {
      console.error('Error during polling update:', err);
    });
  }, interval);
  
  // Return cleanup function
  return () => {
    console.log('Cleaning up polling');
    clearInterval(timerId);
  };
}
