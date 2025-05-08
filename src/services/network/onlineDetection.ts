
/**
 * Network detection service to provide more reliable online/offline status
 */

type ConnectionCallback = (online: boolean) => void;

// Store callbacks
const listeners: ConnectionCallback[] = [];

// Current state
let isOnline = navigator.onLine;

/**
 * Add a listener for connection status changes
 */
export function addConnectionListener(callback: ConnectionCallback): void {
  listeners.push(callback);
  
  // Immediately call with current status
  callback(isOnline);
}

/**
 * Remove a listener
 */
export function removeConnectionListener(callback: ConnectionCallback): void {
  const index = listeners.indexOf(callback);
  if (index !== -1) {
    listeners.splice(index, 1);
  }
}

/**
 * Notify all listeners of a status change
 */
function notifyListeners(online: boolean): void {
  isOnline = online;
  listeners.forEach(callback => callback(online));
}

/**
 * Perform a network check
 * This is more reliable than just using the navigator.onLine property
 */
export async function checkConnection(): Promise<boolean> {
  try {
    // In a real implementation, this would be a tiny request to a reliable endpoint
    // For now, we'll just use the built-in navigator.onLine
    const online = navigator.onLine;
    
    // Only notify if there's a change
    if (online !== isOnline) {
      notifyListeners(online);
    }
    
    return online;
  } catch (err) {
    if (isOnline) {
      // If we got an error and we think we're online, assume we're offline
      notifyListeners(false);
    }
    return false;
  }
}

/**
 * Initialize the network detection service
 */
export function initNetworkDetection(): void {
  // Set up event listeners for online/offline events
  window.addEventListener('online', () => notifyListeners(true));
  window.addEventListener('offline', () => notifyListeners(false));
  
  // Set up periodic checks
  setInterval(checkConnection, 30000);
  
  // Initial check
  checkConnection().catch(err => 
    console.error("Error during initial connection check:", err)
  );
}
