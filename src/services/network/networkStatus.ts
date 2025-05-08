
/**
 * Network status service
 * 
 * This service provides functionality for detecting and responding to
 * online/offline status changes.
 */

// Cache the online status
let isOnlineCache = typeof navigator !== 'undefined' ? navigator.onLine : true;

// Define event listeners
type NetworkStatusListener = (isOnline: boolean) => void;
const listeners: NetworkStatusListener[] = [];

// Initialize event listeners for online/offline events
export function initNetworkListeners(): () => void {
  if (typeof window === 'undefined') return () => {}; // Return empty function if not in browser
  
  const handleOnline = () => {
    isOnlineCache = true;
    console.log('🟢 Network connection restored');
    notifyListeners(true);
  };
  
  const handleOffline = () => {
    isOnlineCache = false;
    console.log('🔴 Network connection lost');
    notifyListeners(false);
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  console.log('Network status listeners initialized');
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

// Subscribe to network status changes
export function subscribeToNetworkStatus(
  callback: NetworkStatusListener
): () => void {
  listeners.push(callback);
  
  // Immediately invoke with current status
  callback(isOnlineCache);
  
  // Return unsubscribe function
  return () => {
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
}

// Notify all listeners of a status change
function notifyListeners(isOnline: boolean): void {
  listeners.forEach(listener => {
    try {
      listener(isOnline);
    } catch (error) {
      console.error('Error in network status listener:', error);
    }
  });
}

// Get the current online status
export function getOnlineStatus(): boolean {
  if (typeof navigator !== 'undefined') {
    // Update the cache with the current status
    isOnlineCache = navigator.onLine;
  }
  return isOnlineCache;
}

// Active network quality check
export async function checkNetworkQuality(): Promise<{
  online: boolean;
  latency: number | null;
  timestamp: string;
}> {
  const timestamp = new Date().toISOString();
  
  if (!getOnlineStatus()) {
    return { online: false, latency: null, timestamp };
  }
  
  try {
    const startTime = performance.now();
    
    // Make a tiny request to verify connectivity
    // Using a timestamp to prevent caching
    const response = await fetch(`/api/ping?t=${Date.now()}`, {
      method: 'HEAD',
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    const isSuccess = response.ok;
    
    // If the status changed, notify listeners
    if (isSuccess !== isOnlineCache) {
      isOnlineCache = isSuccess;
      notifyListeners(isSuccess);
    }
    
    return { online: isSuccess, latency, timestamp };
  } catch (error) {
    console.error('Network quality check failed:', error);
    
    // If the error indicates we're offline, update the cache
    if (isOnlineCache) {
      isOnlineCache = false;
      notifyListeners(false);
    }
    
    return { online: false, latency: null, timestamp };
  }
}

// Initialize on module import
if (typeof window !== 'undefined') {
  initNetworkListeners();
}
