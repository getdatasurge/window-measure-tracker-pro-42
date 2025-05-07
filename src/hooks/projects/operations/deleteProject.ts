
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { withRetry } from '../utils/retry';

/**
 * Custom hook for deleting a project
 */
export function useDeleteProject(
  setState: React.Dispatch<React.SetStateAction<any>>,
  refreshProjects: () => Promise<any>
) {
  /**
   * Delete a project by ID
   */
  const deleteProject = async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await withRetry(async () => {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      });
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: null
      }));
      
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
      
      // Refresh the projects list
      refreshProjects();
      
      return true;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(`Failed to delete project with ID: ${id}`);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj
      }));
      
      toast({
        title: "Error deleting project",
        description: `Could not delete project: ${errorObj.message}`,
        variant: "destructive"
      });
      
      return false;
    }
  };

  return deleteProject;
}
