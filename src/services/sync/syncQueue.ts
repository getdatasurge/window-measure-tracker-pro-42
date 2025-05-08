
/**
 * Sync Queue Service
 * 
 * This service manages the queue of operations that need to be synchronized with
 * the backend when the application comes online.
 */

import { openDB, IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';

const SYNC_DB_NAME = 'window_tracker_sync_queue';
const SYNC_DB_VERSION = 1;
const SYNC_STORE_NAME = 'operations';

export type SyncOperationType = 'create' | 'update' | 'delete';
export type SyncEntityType = 'projects' | 'measurements' | 'settings' | 'activity' | 'measurement';
export type SyncStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface SyncOperation {
  id: string;
  entityType: SyncEntityType;
  entityId: string;
  operationType: SyncOperationType;
  data?: any;
  timestamp: string;
  status: SyncStatus;
  retryCount: number;
  error?: string;
}

let syncDBPromise: Promise<IDBPDatabase> | null = null;

// Initialize the sync queue database
const initSyncDB = async (): Promise<IDBPDatabase> => {
  if (!syncDBPromise) {
    syncDBPromise = openDB(SYNC_DB_NAME, SYNC_DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(SYNC_STORE_NAME)) {
          const store = db.createObjectStore(SYNC_STORE_NAME, { keyPath: 'id' });
          store.createIndex('status', 'status');
          store.createIndex('entityType', 'entityType');
          store.createIndex('timestamp', 'timestamp');
        }
      },
    });
  }
  return syncDBPromise;
};

// Add an operation to the sync queue
export async function addToSyncQueue<T>(
  entityType: SyncEntityType,
  operationType: SyncOperationType,
  entityId: string,
  data?: T
): Promise<string> {
  const db = await initSyncDB();
  
  const operation: SyncOperation = {
    id: uuidv4(),
    entityType,
    entityId,
    operationType,
    data,
    timestamp: new Date().toISOString(),
    status: 'pending',
    retryCount: 0
  };
  
  await db.add(SYNC_STORE_NAME, operation);
  console.log(`Added ${operationType} operation for ${entityType}:${entityId} to sync queue`);
  
  return operation.id;
}

// Get all operations with a specific status
export async function getOperationsByStatus(status: SyncStatus): Promise<SyncOperation[]> {
  const db = await initSyncDB();
  return db.getAllFromIndex(SYNC_STORE_NAME, 'status', status);
}

// Update an operation's status
export async function updateOperationStatus(
  id: string, 
  status: SyncStatus, 
  error?: string
): Promise<void> {
  const db = await initSyncDB();
  const operation = await db.get(SYNC_STORE_NAME, id);
  
  if (!operation) {
    throw new Error(`Operation with id ${id} not found`);
  }
  
  const updatedOperation: SyncOperation = {
    ...operation,
    status,
    error,
    retryCount: status === 'failed' ? operation.retryCount + 1 : operation.retryCount
  };
  
  await db.put(SYNC_STORE_NAME, updatedOperation);
}

// Process the sync queue
export async function processSyncQueue(): Promise<{
  success: boolean;
  processed: number;
  failed: number;
}> {
  const pendingOperations = await getOperationsByStatus('pending');
  
  if (pendingOperations.length === 0) {
    return { success: true, processed: 0, failed: 0 };
  }
  
  let processed = 0;
  let failed = 0;
  
  for (const operation of pendingOperations) {
    try {
      // Mark as processing
      await updateOperationStatus(operation.id, 'processing');
      
      // In a real implementation, this would call an API
      // For now, we'll just simulate a successful sync
      // await syncWithBackend(operation);
      console.log(`Processing operation: ${operation.operationType} on ${operation.entityType}:${operation.entityId}`);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mark as completed
      await updateOperationStatus(operation.id, 'completed');
      processed++;
    } catch (error) {
      console.error(`Failed to process operation ${operation.id}:`, error);
      await updateOperationStatus(
        operation.id, 
        'failed', 
        error instanceof Error ? error.message : String(error)
      );
      failed++;
    }
  }
  
  return {
    success: failed === 0,
    processed,
    failed
  };
}

// Get statistics about the queue
export async function getSyncQueueStats(): Promise<{
  pending: number;
  processing: number;
  failed: number;
  completed: number;
}> {
  const db = await initSyncDB();
  
  const [pending, processing, failed, completed] = await Promise.all([
    db.countFromIndex(SYNC_STORE_NAME, 'status', 'pending'),
    db.countFromIndex(SYNC_STORE_NAME, 'status', 'processing'),
    db.countFromIndex(SYNC_STORE_NAME, 'status', 'failed'),
    db.countFromIndex(SYNC_STORE_NAME, 'status', 'completed')
  ]);
  
  return {
    pending,
    processing,
    failed,
    completed
  };
}

// Clear completed operations
export async function clearCompletedOperations(): Promise<number> {
  const db = await initSyncDB();
  const completedOps = await db.getAllFromIndex(SYNC_STORE_NAME, 'status', 'completed');
  
  let count = 0;
  for (const op of completedOps) {
    await db.delete(SYNC_STORE_NAME, op.id);
    count++;
  }
  
  return count;
}

// Initialize the sync queue on module import
initSyncDB().catch(error => {
  console.error('Failed to initialize sync queue database:', error);
});
