
import { supabase } from '@/integrations/supabase/client';
import { EntryData } from '@/types/entries';
import { logEntryHistory, findPreviousStatus } from './entryHistoryService';
import { toast } from 'react-toastify';

/**
 * Retrieves entries for a specific project
 */
export const getEntriesByProject = async (
  projectId: string, 
  includeDeleted = false
): Promise<EntryData[]> => {
  try {
    let query = supabase
      .from('entries')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    // Only include non-deleted entries unless specifically requested
    if (!includeDeleted) {
      query = query.neq('status', 'deleted');
    }

    const { data: entries, error } = await query;

    if (error) {
      throw error;
    }

    return entries.map(entry => ({
      ...entry,
      status: entry.status as EntryData['status']
    }));
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to fetch entries');
    toast.error('Failed to load entries');
    return [];
  }
};

/**
 * Creates a new entry
 */
export const createEntry = async (
  entryData: Omit<EntryData, 'id' | 'created_by'>,
  userId?: string
): Promise<EntryData | null> => {
  try {
    // Set created_by to current user's ID
    const data = {
      ...entryData,
      created_by: userId
    };

    const { data: newEntry, error } = await supabase
      .from('entries')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success('Entry created successfully');
    return {
      ...newEntry,
      status: newEntry.status as EntryData['status']
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to create entry');
    toast.error('Failed to create entry');
    return null;
  }
};

/**
 * Updates an existing entry
 */
export const updateEntry = async (
  id: string, 
  entryData: Partial<EntryData>,
  userId?: string
): Promise<EntryData | null> => {
  try {
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
    await logEntryHistory(id, currentEntry as EntryData, 'update', userId);
    
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
      status: updatedEntry.status as EntryData['status']
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to update entry');
    toast.error('Failed to update entry');
    return null;
  }
};

/**
 * Soft deletes an entry by changing its status to 'deleted'
 */
export const deleteEntry = async (
  id: string,
  userId?: string
): Promise<boolean> => {
  try {
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
    await logEntryHistory(id, currentEntry as EntryData, 'delete', userId);
    
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
    toast.error('Failed to delete entry');
    return false;
  }
};

/**
 * Restores a deleted entry
 */
export const restoreEntry = async (
  id: string,
  userId?: string
): Promise<EntryData | null> => {
  try {
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
      return currentEntry as EntryData;
    }
    
    // Find the previous status
    const previousStatus = await findPreviousStatus(id);
    
    // Log the restoration to history
    await logEntryHistory(id, currentEntry as EntryData, 'restore', userId);
    
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
      status: restoredEntry.status as EntryData['status']
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to restore entry');
    toast.error('Failed to restore entry');
    return null;
  }
};

/**
 * Split an entry into two: update the original and create a new entry
 */
export const splitEntry = async (
  id: string, 
  originalUpdateData: Partial<EntryData>,
  newEntryData: Omit<EntryData, 'id' | 'created_by'>,
  userId?: string
) => {
  try {
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
    await logEntryHistory(id, currentEntry as EntryData, 'update', userId);
    
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
        created_by: userId
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
        status: newEntry.status as EntryData['status']
      }
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to split entry');
    toast.error('Failed to split entry');
    return { updatedOriginal: false, newEntry: null };
  }
};
