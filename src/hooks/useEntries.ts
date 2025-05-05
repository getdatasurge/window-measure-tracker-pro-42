
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'react-toastify';

export interface EntryData {
  id?: string;
  project_id: string;
  created_by?: string;
  room: string;
  floor?: string;
  width: number;
  height: number;
  quantity: number;
  film_required: boolean;
  notes?: string;
  status: EntryStatus;
  created_at?: string;
  updated_at?: string;
}

export type EntryStatus = 'measured' | 'cut' | 'installed' | 'under_review' | 'deleted';

/**
 * Helper function to convert fractional string measurements to decimal
 * Handles formats like "2 1/2" converting to 2.5
 */
export const fractionToDecimal = (input: string): number => {
  // Remove any extra spaces and trim
  const trimmedInput = input.trim();
  
  // Check if input is already a number
  if (!isNaN(Number(trimmedInput))) {
    return Number(trimmedInput);
  }
  
  // Handle inputs like "2 1/2"
  const wholeFractionRegex = /^(\d+)\s+(\d+)\/(\d+)$/;
  const wholeFractionMatch = trimmedInput.match(wholeFractionRegex);
  if (wholeFractionMatch) {
    const whole = parseInt(wholeFractionMatch[1], 10);
    const numerator = parseInt(wholeFractionMatch[2], 10);
    const denominator = parseInt(wholeFractionMatch[3], 10);
    if (denominator === 0) return whole; // Prevent division by zero
    return whole + (numerator / denominator);
  }
  
  // Handle inputs like "1/2"
  const fractionRegex = /^(\d+)\/(\d+)$/;
  const fractionMatch = trimmedInput.match(fractionRegex);
  if (fractionMatch) {
    const numerator = parseInt(fractionMatch[1], 10);
    const denominator = parseInt(fractionMatch[2], 10);
    if (denominator === 0) return 0; // Prevent division by zero
    return numerator / denominator;
  }
  
  // If no patterns match, just try to convert directly
  return Number(trimmedInput) || 0;
};

export const useEntries = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();

  const getEntriesByProject = async (projectId: string, includeDeleted = false) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('entries')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      // Only include non-deleted entries unless specifically requested
      if (!includeDeleted) {
        query = query.neq('status', 'deleted');
      }

      const { data: entries, error: entriesError } = await query;

      if (entriesError) {
        throw entriesError;
      }

      return entries.map(entry => ({
        ...entry,
        status: entry.status as EntryStatus
      }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch entries');
      setError(error);
      toast.error('Failed to load entries');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Helper function to log entry history
  const logEntryHistory = async (entryId: string, dataSnapshot: EntryData, actionType: 'update' | 'delete' | 'restore') => {
    try {
      const { error } = await supabase
        .from('entry_history')
        .insert({
          entry_id: entryId,
          data_snapshot: dataSnapshot,
          updated_by: user?.id,
          action_type: actionType
        });
      
      if (error) {
        console.error('Error logging entry history:', error);
      }
    } catch (err) {
      console.error('Failed to log entry history:', err);
    }
  };

  const createEntry = async (entryData: Omit<EntryData, 'id' | 'created_by'>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Set created_by to current user's ID
      const data = {
        ...entryData,
        created_by: user?.id
      };

      const { data: newEntry, error: createError } = await supabase
        .from('entries')
        .insert(data)
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      toast.success('Entry created successfully');
      return {
        ...newEntry,
        status: newEntry.status as EntryStatus
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create entry');
      setError(error);
      toast.error('Failed to create entry');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (id: string, entryData: Partial<EntryData>) => {
    try {
      setLoading(true);
      setError(null);
      
      // First get the current entry to save in history
      const { data: currentEntry, error: fetchError } = await supabase
        .from('entries')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Log the current state to history before updating
      await logEntryHistory(id, currentEntry, 'update');
      
      // Now update the entry
      const { data: updatedEntry, error: updateError } = await supabase
        .from('entries')
        .update(entryData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      toast.success('Entry updated successfully');
      return {
        ...updatedEntry,
        status: updatedEntry.status as EntryStatus
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update entry');
      setError(error);
      toast.error('Failed to update entry');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // First get the current entry to save in history
      const { data: currentEntry, error: fetchError } = await supabase
        .from('entries')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Log the current state to history before soft-deleting
      await logEntryHistory(id, currentEntry, 'delete');
      
      // Soft delete - just update the status
      const { data: deletedEntry, error: deleteError } = await supabase
        .from('entries')
        .update({ status: 'deleted' })
        .eq('id', id)
        .select()
        .single();

      if (deleteError) {
        throw deleteError;
      }

      toast.success('Entry deleted successfully');
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete entry');
      setError(error);
      toast.error('Failed to delete entry');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // New function to restore a deleted entry
  const restoreEntry = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if the entry is actually deleted
      const { data: currentEntry, error: fetchError } = await supabase
        .from('entries')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (currentEntry.status !== 'deleted') {
        toast.info('Entry is not deleted, no need to restore');
        return false;
      }
      
      // Find the last state before deletion in history
      const { data: historyEntries, error: historyError } = await supabase
        .from('entry_history')
        .select('*')
        .eq('entry_id', id)
        .eq('action_type', 'delete')
        .order('timestamp', { ascending: false })
        .limit(1);
      
      if (historyError) {
        throw historyError;
      }
      
      let previousStatus: EntryStatus = 'measured'; // Default fallback status
      
      if (historyEntries && historyEntries.length > 0) {
        const historyData = historyEntries[0].data_snapshot;
        previousStatus = historyData.status;
      }
      
      // Log the restoration to history
      await logEntryHistory(id, currentEntry, 'restore');
      
      // Update the entry with the previous status
      const { data: restoredEntry, error: updateError } = await supabase
        .from('entries')
        .update({ status: previousStatus })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      toast.success('Entry restored successfully');
      return {
        ...restoredEntry,
        status: restoredEntry.status as EntryStatus
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to restore entry');
      setError(error);
      toast.error('Failed to restore entry');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Split an entry into two: update the original and create a new entry
  const splitEntry = async (
    id: string, 
    originalUpdateData: Partial<EntryData>,
    newEntryData: Omit<EntryData, 'id' | 'created_by'>
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      // First get the current entry to save in history
      const { data: currentEntry, error: fetchError } = await supabase
        .from('entries')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Log the current state to history before updating
      await logEntryHistory(id, currentEntry, 'update');
      
      // First update the original entry
      const { error: updateError } = await supabase
        .from('entries')
        .update(originalUpdateData)
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }
      
      // Then create the new entry
      const { data: newEntry, error: createError } = await supabase
        .from('entries')
        .insert({
          ...newEntryData,
          created_by: user?.id
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      toast.success('Entry split successfully');
      return { 
        updatedOriginal: true, 
        newEntry: {
          ...newEntry,
          status: newEntry.status as EntryStatus
        }
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to split entry');
      setError(error);
      toast.error('Failed to split entry');
      return { updatedOriginal: false, newEntry: null };
    } finally {
      setLoading(false);
    }
  };

  // Get entry history for a specific entry
  const getEntryHistory = async (entryId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: historyEntries, error: historyError } = await supabase
        .from('entry_history')
        .select('*')
        .eq('entry_id', entryId)
        .order('timestamp', { ascending: false });
      
      if (historyError) {
        throw historyError;
      }

      return historyEntries;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch entry history');
      setError(error);
      toast.error('Failed to load entry history');
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
    getEntryHistory
  };
};
