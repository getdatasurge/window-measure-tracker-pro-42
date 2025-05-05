
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { EntryData, SplitEntryResult } from '@/types/entries';
import * as entryService from '@/services/entryService';
import * as entryHistoryService from '@/services/entryHistoryService';
import { fractionToDecimal } from '@/utils/measurementUtils';

/**
 * Hook for managing entry CRUD operations and history
 */
export const useEntries = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();

  const getEntriesByProject = async (projectId: string, includeDeleted = false) => {
    try {
      setLoading(true);
      setError(null);
      return await entryService.getEntriesByProject(projectId, includeDeleted);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch entries');
      setError(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entryData: Omit<EntryData, 'id' | 'created_by'>) => {
    try {
      setLoading(true);
      setError(null);
      return await entryService.createEntry(entryData, user?.id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create entry');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (id: string, entryData: Partial<EntryData>) => {
    try {
      setLoading(true);
      setError(null);
      return await entryService.updateEntry(id, entryData, user?.id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update entry');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      return await entryService.deleteEntry(id, user?.id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete entry');
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const restoreEntry = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      return await entryService.restoreEntry(id, user?.id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to restore entry');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const splitEntry = async (
    id: string, 
    originalUpdateData: Partial<EntryData>,
    newEntryData: Omit<EntryData, 'id' | 'created_by'>
  ): Promise<SplitEntryResult> => {
    try {
      setLoading(true);
      setError(null);
      return await entryService.splitEntry(id, originalUpdateData, newEntryData, user?.id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to split entry');
      setError(error);
      return { updatedOriginal: false, newEntry: null };
    } finally {
      setLoading(false);
    }
  };

  const getEntryHistory = async (entryId: string) => {
    try {
      setLoading(true);
      setError(null);
      return await entryHistoryService.getEntryHistory(entryId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch entry history');
      setError(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getEntriesByProject,
    createEntry,
    updateEntry,
    deleteEntry,
    splitEntry,
    restoreEntry,
    getEntryHistory,
    fractionToDecimal
  };
};

// Re-export the fractionToDecimal function for direct imports
export { fractionToDecimal } from '@/utils/measurementUtils';
export type { EntryData, EntryStatus } from '@/types/entries';
