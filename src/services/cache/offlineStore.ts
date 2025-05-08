
/**
 * Offline storage service using IndexedDB
 * 
 * This service provides a simple API for storing and retrieving data locally,
 * allowing the application to function offline.
 */

import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'window_tracker_offline';
const DB_VERSION = 1;

// Entity types that can be stored offline
export type EntityType = 
  | 'projects'
  | 'measurements'
  | 'settings'
  | 'activity';

interface StoredEntity {
  id: string;
  data: unknown;
  updatedAt: string;
  syncStatus?: 'pending' | 'synced' | 'error';
}

// Initialize IndexedDB
let dbPromise: Promise<IDBPDatabase> | null = null;

export const initDB = async (): Promise<IDBPDatabase> => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create stores for each entity type
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('measurements')) {
          db.createObjectStore('measurements', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('activity')) {
          db.createObjectStore('activity', { keyPath: 'id' });
        }
        
        console.log('IndexedDB initialized with stores:', db.objectStoreNames);
      },
    });
  }
  return dbPromise;
};

// Get a single entity by ID
export async function getEntity<T>(entityType: EntityType, id: string): Promise<T | null> {
  try {
    const db = await initDB();
    const stored = await db.get(entityType, id) as StoredEntity | undefined;
    
    if (!stored) return null;
    return stored.data as T;
  } catch (error) {
    console.error(`Error getting ${entityType} with id ${id}:`, error);
    throw error;
  }
}

// Get all entities of a specific type
export async function getAllEntities<T>(entityType: EntityType): Promise<T[]> {
  try {
    const db = await initDB();
    const all = await db.getAll(entityType) as StoredEntity[];
    
    return all.map(item => item.data as T);
  } catch (error) {
    console.error(`Error getting all ${entityType}:`, error);
    throw error;
  }
}

// Store an entity
export async function storeEntity<T>(entityType: EntityType, id: string, data: T): Promise<void> {
  try {
    const db = await initDB();
    const storedEntity: StoredEntity = {
      id,
      data,
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending'
    };
    
    await db.put(entityType, storedEntity);
  } catch (error) {
    console.error(`Error storing ${entityType}:`, error);
    throw error;
  }
}

// Update an entity (partial update)
export async function updateEntity<T>(entityType: EntityType, id: string, partialData: Partial<T>): Promise<void> {
  try {
    const db = await initDB();
    const stored = await db.get(entityType, id) as StoredEntity | undefined;
    
    if (!stored) {
      throw new Error(`${entityType} with id ${id} not found`);
    }
    
    const updatedData = {
      ...stored.data as object,
      ...partialData
    };
    
    const updatedEntity: StoredEntity = {
      ...stored,
      data: updatedData,
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending'
    };
    
    await db.put(entityType, updatedEntity);
  } catch (error) {
    console.error(`Error updating ${entityType} with id ${id}:`, error);
    throw error;
  }
}

// Remove an entity
export async function removeEntity(entityType: EntityType, id: string): Promise<void> {
  try {
    const db = await initDB();
    await db.delete(entityType, id);
  } catch (error) {
    console.error(`Error removing ${entityType} with id ${id}:`, error);
    throw error;
  }
}

// Clear all entities of a specific type
export async function clearEntities(entityType: EntityType): Promise<void> {
  try {
    const db = await initDB();
    await db.clear(entityType);
  } catch (error) {
    console.error(`Error clearing all ${entityType}:`, error);
    throw error;
  }
}

// Mark an entity as synced
export async function markEntitySynced(entityType: EntityType, id: string): Promise<void> {
  try {
    const db = await initDB();
    const stored = await db.get(entityType, id) as StoredEntity | undefined;
    
    if (!stored) return;
    
    const updatedEntity: StoredEntity = {
      ...stored,
      syncStatus: 'synced'
    };
    
    await db.put(entityType, updatedEntity);
  } catch (error) {
    console.error(`Error marking ${entityType} with id ${id} as synced:`, error);
    throw error;
  }
}

// Get all entities that need to be synced
export async function getPendingSyncEntities<T>(entityType: EntityType): Promise<Array<{id: string, data: T}>> {
  try {
    const db = await initDB();
    const all = await db.getAll(entityType) as StoredEntity[];
    
    return all
      .filter(item => item.syncStatus === 'pending')
      .map(item => ({
        id: item.id,
        data: item.data as T
      }));
  } catch (error) {
    console.error(`Error getting pending sync ${entityType}:`, error);
    throw error;
  }
}

// Initialize the database on module import
initDB().catch(error => {
  console.error('Failed to initialize IndexedDB:', error);
});
