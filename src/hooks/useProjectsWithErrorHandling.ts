import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { tryAsync, withErrorHandling } from '@/utils/error-handling/index';

// Define interfaces locally to avoid circular dependencies
interface ProjectOption {
  id: string;
  name: string;
  client_name?: string;
  location?: string;
  status?: string;
  deadline?: string;
}

interface ProjectDetails extends ProjectOption {
  description?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

interface ProjectCreateInput {
  name: string;
  client_name?: string;
  location?: string;
  description?: string;
  deadline?: string;
}

interface ProjectUpdateInput {
  name?: string;
  client_name?: string;
  location?: string;
  description?: string;
  deadline?: string;
  status?: string;
}

interface ProjectsHookState {
  loading: boolean;
  error: Error | null;
  projects: ProjectOption[];
  selectedProject: ProjectDetails | null;
}

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

/**
 * Hook for interacting with project data with built-in error handling and resilience
 * Features automatic retries, comprehensive error handling and real-time status updates
 */
export function useProjectsWithErrorHandling() {
  const [state, setState] = useState<ProjectsHookState>({
    loading: false,
    error: null,
    projects: [],
    selectedProject: null
  });
  
  /**
   * Helper function to implement retry logic
   */
  const withRetry = async <T,>(
    operation: () => Promise<T>,
    attempts: number = RETRY_ATTEMPTS
  ): Promise<T> => {
    let lastError: Error | null = null;
    
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`Attempt ${i + 1}/${attempts} failed:`, lastError.message);
        
        // Don't wait on the last attempt
        if (i < attempts - 1) {
          // Exponential backoff with jitter
          const delay = RETRY_DELAY * Math.pow(2, i) + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError || new Error('Operation failed after multiple attempts');
  };
  
  /**
   * Fetch all projects
   */
  const fetchProjects = useCallback(async (activeOnly = true): Promise<ProjectOption[]> => {
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
  }, []);
  
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
        fetchProjects();
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
        fetchProjects();
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
  
  /**
   * Delete a project
   */
  const deleteProject = async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const success = await withRetry(async () => {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        return true;
      });
      
      setState(prev => ({
        ...prev,
        loading: false,
        selectedProject: prev.selectedProject?.id === id ? null : prev.selectedProject,
        error: null
      }));
      
      if (success) {
        toast({
          title: "Project deleted",
          description: "Project has been successfully deleted",
        });
        
        // Refresh the projects list
        fetchProjects();
      }
      
      return success;
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
  
  return {
    ...state,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    isLoading: state.loading
  };
}
