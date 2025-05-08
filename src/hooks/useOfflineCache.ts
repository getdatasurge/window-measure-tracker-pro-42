
/**
 * Hook for interacting with the offline cache
 */

import { useState, useCallback } from 'react';
import * as offlineStore from '../services/cache/offlineStore';

export function useOfflineCache<T>(entityType: offlineStore.EntityType) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get a single entity by ID
  const getItem = useCallback(
    async (id: string): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const entity = await offlineStore.getEntity<T>(entityType, id);
        return entity;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [entityType]
  );

  // Get all entities of the specified type
  const getAllItems = useCallback(
    async (): Promise<T[]> => {
      setIsLoading(true);
      setError(null);
      try {
        const entities = await offlineStore.getAllEntities<T>(entityType);
        return entities;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [entityType]
  );

  // Store a new entity or update an existing one
  const setItem = useCallback(
    async (id: string, data: T): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        await offlineStore.storeEntity(entityType, id, data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [entityType]
  );

  // Update an existing entity
  const updateItem = useCallback(
    async (id: string, data: Partial<T>): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        await offlineStore.updateEntity(entityType, id, data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [entityType]
  );

  // Remove an entity
  const removeItem = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        await offlineStore.removeEntity(entityType, id);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [entityType]
  );

  // Clear all entities of this type
  const clearItems = useCallback(
    async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        await offlineStore.clearEntities(entityType);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [entityType]
  );

  return {
    isLoading,
    error,
    getItem,
    getAllItems,
    setItem,
    updateItem,
    removeItem,
    clearItems
  };
}
