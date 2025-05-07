
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Use the values directly from the existing integrations folder
const SUPABASE_URL = "https://bvipslspkgbjovgztubb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2aXBzbHNwa2diam92Z3p0dWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MTAyOTIsImV4cCI6MjA2MjE4NjI5Mn0.T0u-GMLEloqY9zY8HRYGP_dVxCtTR-UHu0SRT163X1Y";

// Create a Supabase client instance for use with RTK Query
export const supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export a function to handle Supabase errors consistently
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);
  
  if (typeof error === 'object' && error !== null) {
    // Return the error message if it exists
    return error.message || 'An unknown error occurred';
  }
  
  return 'An unknown error occurred';
};
