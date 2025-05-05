
import { supabase } from '@/integrations/supabase/client';
import { EntryData, EntryHistoryData } from '@/types/entries';

/**
 * Logs an entry action to the entry_history table
 */
export const logEntryHistory = async (
  entryId: string, 
  dataSnapshot: EntryData, 
  actionType: 'update' | 'delete' | 'restore',
  userId?: string
): Promise<boolean> => {
  try {
    // Convert the EntryData to a plain object for storage
    const dataToStore = {
      ...dataSnapshot
    };

    const { error } = await supabase
      .from('entry_history')
      .insert({
        entry_id: entryId,
        data_snapshot: dataToStore,
        updated_by: userId || '',
        action_type: actionType
      });
    
    if (error) {
      console.error('Error logging entry history:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to log entry history:', err);
    return false;
  }
};

/**
 * Retrieves the history for a specific entry
 */
export const getEntryHistory = async (entryId: string): Promise<EntryHistoryData[]> => {
  try {
    const { data: historyEntries, error } = await supabase
      .from('entry_history')
      .select('*')
      .eq('entry_id', entryId)
      .order('timestamp', { ascending: false });
    
    if (error) {
      throw error;
    }

    return historyEntries as EntryHistoryData[];
  } catch (err) {
    console.error('Failed to fetch entry history:', err);
    return [];
  }
};

/**
 * Finds the previous status of an entry before deletion
 */
export const findPreviousStatus = async (entryId: string): Promise<string> => {
  try {
    const { data: historyEntries, error } = await supabase
      .from('entry_history')
      .select('*')
      .eq('entry_id', entryId)
      .eq('action_type', 'delete')
      .order('timestamp', { ascending: false })
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    if (historyEntries && historyEntries.length > 0) {
      const previousData = historyEntries[0].data_snapshot;
      return previousData.status || 'measured';
    }
    
    return 'measured'; // Default fallback status
  } catch (err) {
    console.error('Failed to find previous status:', err);
    return 'measured';
  }
};
