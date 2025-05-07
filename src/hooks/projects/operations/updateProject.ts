
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProjectDetails, ProjectUpdateInput } from '@/types/project-types';
import { withRetry } from '../utils/retry';

/**
 * Custom hook for updating an existing project
 */
export function useUpdateProject(
  setState: React.Dispatch<React.SetStateAction<any>>,
  refreshProjects: () => Promise<any>
) {
  /**
   * Update an existing project
   */
  const updateProject = async (id: string, projectData: ProjectUpdateInput): Promise<ProjectDetails | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await withRetry(async () => {
        const { data, error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id)
          .select();
          
        if (error) throw error;
        
        return data?.[0] || null;
      });
      
      setState(prev => ({
        ...prev,
        loading: false,
        selectedProject: data || prev.selectedProject,
        error: null
      }));
      
      if (data) {
        toast({
          title: "Project updated",
          description: `Successfully updated project: ${data.name || 'Unnamed project'}`,
        });
        
        // Refresh the projects list
        refreshProjects();
      }
      
      return data;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(`Failed to update project with ID: ${id}`);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj
      }));
      
      toast({
        title: "Error updating project",
        description: `Could not update project: ${errorObj.message}`,
        variant: "destructive"
      });
      
      return null;
    }
  };

  return updateProject;
}
