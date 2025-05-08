
/**
 * Hook for interacting with the sync queue
 */

import { useState, useCallback } from 'react';
import * as syncQueue from '../services/sync/syncQueue';
import { useOnlineStatus } from './useOnlineStatus';

export function useSyncQueue() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isOnline } = useOnlineStatus();
  
  // Add an operation to the sync queue
  const addOperation = useCallback(
    async <T>(
      entityType: syncQueue.SyncOperation['entityType'],
      operationType: syncQueue.SyncOperation['operationType'],
      entityId: string,
      data: T
    ): Promise<string> => {
      setError(null);
      try {
        const operationId = await syncQueue.addToSyncQueue(
          entityType,
          operationType,
          entityId,
          data
        );
        
        // If we're online, we could process the queue immediately
        if (isOnline) {
          processQueue().catch(err => 
            console.error("Error processing queue after add:", err)
          );
        }
        
        return operationId;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [isOnline]
  );

  // Process all pending operations in the sync queue
  const processQueue = useCallback(async () => {
    if (!isOnline) {
      console.log('Not online, skipping sync queue processing');
      return { success: false, processed: 0, failed: 0 };
    }
    
    setIsProcessing(true);
    setError(null);
    try {
      const result = await syncQueue.processSyncQueue();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return { success: false, processed: 0, failed: 1 };
    } finally {
      setIsProcessing(false);
    }
  }, [isOnline]);

  // Get statistics about the sync queue
  const getQueueStats = useCallback(async () => {
    setError(null);
    try {
      return await syncQueue.getSyncQueueStats();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return { pending: 0, processing: 0, failed: 0, completed: 0 };
    }
  }, []);

  // Clean up completed operations
  const clearCompleted = useCallback(async () => {
    setError(null);
    try {
      return await syncQueue.clearCompletedOperations();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return 0;
    }
  }, []);

  return {
    addOperation,
    processQueue,
    getQueueStats,
    clearCompleted,
    isProcessing,
    error
  };
}
