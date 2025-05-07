
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProjectOption } from '../types';
import { withRetry } from '../utils/retry';

/**
 * Custom hook for fetching projects with error handling
 */
export function useFetchProjects(setState: React.Dispatch<React.SetStateAction<any>>) {
  /**
   * Fetch all projects
   */
  const fetchProjects = async (activeOnly = true): Promise<ProjectOption[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const projects = await withRetry(async () => {
        let query = supabase
          .from('projects')
          .select('id, name, client_name, location, status, deadline');
        
        if (activeOnly) {
          // Use is_active if it exists, otherwise filter by status
          try {
            query = query.eq('is_active', true);
          } catch {
            query = query.neq('status', 'archived');
          }
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        return data || [];
      });
      
      setState(prev => ({
        ...prev,
        loading: false,
        projects,
        error: null
      }));
      
      return projects;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Failed to fetch projects');
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj
      }));
      
      toast({
        title: "Error loading projects",
        description: "Failed to load projects. Please try again later.",
        variant: "destructive"
      });
      
      return [];
    }
  };

  return fetchProjects;
}
