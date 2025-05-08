
/**
 * Hook for detecting and responding to online/offline status changes
 */

import { useState, useEffect, useCallback } from 'react';

export interface OnlineStatusState {
  isOnline: boolean;
  wasOffline: boolean; // Tracks if there was a recent offline state
  lastChanged: number | null; // Timestamp of the last status change
}

export function useOnlineStatus() {
  const [status, setStatus] = useState<OnlineStatusState>({
    isOnline: navigator.onLine,
    wasOffline: false,
    lastChanged: null
  });

  // Handle online status change
  const handleOnlineStatusChange = useCallback((online: boolean) => {
    setStatus(prevStatus => ({
      isOnline: online,
      // If we're going from offline to online, set wasOffline to true
      // This helps UIs show "recently reconnected" states
      wasOffline: online ? true : prevStatus.wasOffline,
      lastChanged: Date.now()
    }));
    
    // If we're coming back online, we could trigger sync operations here
    if (online) {
      console.log('Back online - could trigger sync operations');
    }
  }, []);

  // Reset the wasOffline flag (useful after showing reconnection notifications)
  const resetWasOffline = useCallback(() => {
    setStatus(prev => ({
      ...prev,
      wasOffline: false
    }));
  }, []);

  // Set up event listeners for online/offline events
  useEffect(() => {
    const handleOnline = () => handleOnlineStatusChange(true);
    const handleOffline = () => handleOnlineStatusChange(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnlineStatusChange]);

  // Additional heartbeat check for more reliable detection
  useEffect(() => {
    // This would normally ping a lightweight endpoint to verify connection
    // For now, we'll just use the built-in navigator.onLine
    
    const checkConnection = async () => {
      // In a real implementation, we would make a tiny request to verify
      // Instead, we'll just use the navigator.onLine value
      const online = navigator.onLine;
      
      if (online !== status.isOnline) {
        handleOnlineStatusChange(online);
      }
    };
    
    // Run an initial check
    checkConnection();
    
    // Set up periodic checks (every 30 seconds)
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, [handleOnlineStatusChange, status.isOnline]);

  return {
    ...status,
    resetWasOffline
  };
}
