
/**
 * Setup polling as a fallback for real-time updates
 * 
 * @param refreshFn Function to call for refreshing data
 * @param intervalMs Polling interval in milliseconds
 * @returns Cleanup function
 */
export function setupPolling(refreshFn: () => Promise<any>, intervalMs: number = 30000) {
  console.info('Starting polling fallback mechanism');
  
  // Poll for updates on the specified interval
  const intervalId = setInterval(() => {
    console.info('Polling for measurement updates...');
    refreshFn();
  }, intervalMs);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
}
