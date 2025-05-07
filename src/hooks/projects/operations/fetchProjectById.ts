
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProjectDetails } from '@/types/project-types';
import { withRetry } from '../utils/retry';

/**
 * Custom hook for fetching a specific project by ID
 */
export function useFetchProjectById(setState: React.Dispatch<React.SetStateAction<any>>) {
  /**
   * Fetch a specific project by ID
   */
  const fetchProjectById = async (id: string): Promise<ProjectDetails | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await withRetry(async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        return data;
      });
      
      setState(prev => ({
        ...prev,
        loading: false,
        selectedProject: data,
        error: null
      }));
      
      return data;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(`Failed to fetch project with ID: ${id}`);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj
      }));
      
      toast({
        title: "Error loading project",
        description: `Could not load project details: ${errorObj.message}`,
        variant: "destructive"
      });
      
      return null;
    }
  };

  return fetchProjectById;
}
