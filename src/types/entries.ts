
// Entry-related types

export type EntryStatus = 'measured' | 'cut' | 'installed' | 'under_review' | 'deleted';

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

export interface EntryHistoryData {
  id?: string;
  entry_id: string;
  data_snapshot: Record<string, any>; // Using Record to ensure it's treated as a JSON object
  updated_by: string;
  action_type: 'update' | 'delete' | 'restore';
  timestamp?: string;
}

export interface SplitEntryResult {
  updatedOriginal: boolean;
  newEntry: EntryData | null;
}
