
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProjectDetails, ProjectCreateInput } from '@/types/project-types';
import { withRetry } from '../utils/retry';

/**
 * Custom hook for creating a new project
 */
export function useCreateProject(
  setState: React.Dispatch<React.SetStateAction<any>>,
  refreshProjects: () => Promise<any>
) {
  /**
   * Create a new project with error handling
   */
  const createProject = async (projectData: ProjectCreateInput): Promise<ProjectDetails | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await withRetry(async () => {
        const { data, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select();
          
        if (error) throw error;
        
        return data?.[0] || null;
      });
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: null
      }));
      
      if (data) {
        toast({
          title: "Project created",
          description: `Successfully created project: ${data.name || 'Unnamed project'}`,
        });
        
        // Refresh the projects list
        refreshProjects();
      }
      
      return data;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Failed to create project');
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj
      }));
      
      toast({
        title: "Error creating project",
        description: `Could not create project: ${errorObj.message}`,
        variant: "destructive"
      });
      
      return null;
    }
  };

  return createProject;
}
