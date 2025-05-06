import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'react-toastify';

export interface ProjectData {
  id?: string;
  name: string;
  location?: string;
  description?: string;
  deadline?: string;
  client_name?: string;
  status?: string;
}

export interface ProjectAssignment {
  project_id: string;
  user_id: string;
  role?: string;
}

export const useProjects = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();

  const getProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // RLS will handle filtering to only show projects the user has access to
      // (either as creator or through project_assignments)
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*');

      if (projectsError) {
        throw projectsError;
      }

      return projects || [];
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch projects');
      setError(error);
      toast.error('Failed to load your projects');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: ProjectData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Always ensure created_by is set to the current user's ID
      const data = {
        ...projectData,
        created_by: user?.id
      };

      const { data: newProject, error: createError } = await supabase
        .from('projects')
        .insert(data)
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      toast.success('Project created successfully');
      return newProject;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create project');
      setError(error);
      toast.error('Failed to create project');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id: string, projectData: Partial<ProjectData>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: updatedProject, error: updateError } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      toast.success('Project updated successfully');
      return updatedProject;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update project');
      setError(error);
      toast.error('Failed to update project');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Delete the project
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      toast.success('Project deleted successfully');
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete project');
      setError(error);
      toast.error('Failed to delete project');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const assignUserToProject = async (assignment: ProjectAssignment) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: assignError } = await supabase
        .from('project_assignments')
        .insert(assignment);

      if (assignError) {
        throw assignError;
      }

      toast.success('User assigned to project successfully');
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to assign user to project');
      setError(error);
      toast.error('Failed to assign user to project');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    assignUserToProject
  };
};
