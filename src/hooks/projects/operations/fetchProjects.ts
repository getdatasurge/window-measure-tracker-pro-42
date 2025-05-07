
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ProjectsHookState } from '../types';
import { ProjectOption } from '@/types/project-types';

/**
 * Hook for fetching projects with proper error handling
 */
export function useFetchProjects(
  setState: React.Dispatch<React.SetStateAction<ProjectsHookState>>
) {
  return async (activeOnly = true) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    
    try {
      let query = supabase
        .from('projects')
        .select('id, name, client_name, location, status, deadline');
      
      if (activeOnly) {
        query = query.eq('status', 'active');
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      const projects = (data || []) as ProjectOption[];
      
      setState(prevState => ({
        ...prevState,
        loading: false,
        projects,
        error: null
      }));
      
      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to fetch projects')
      }));
      
      toast({
        title: 'Error loading projects',
        description: 'Failed to load projects. Please try again later.',
        variant: 'destructive'
      });
      
      return [];
    }
  };
}
