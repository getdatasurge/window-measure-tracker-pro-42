
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Define interfaces directly to avoid circular dependencies
interface ProjectOption {
  id: string;
  name: string;
  client_name?: string;
  location?: string;
  status?: string;
}

interface ProjectDetails extends ProjectOption {
  deadline?: string;
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

/**
 * Fetch projects with optional filtering
 * @param activeOnly Whether to only fetch active projects
 * @returns Array of projects
 */
export const fetchProjects = async (activeOnly = true): Promise<ProjectOption[]> => {
  try {
    let query = supabase
      .from('projects')
      .select('id, name, client_name, location, status, deadline');
      
    if (activeOnly) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching projects:', error);
    toast({
      title: "Error loading projects",
      description: "Failed to load projects. Please try again later.",
      variant: "destructive"
    });
    return [];
  }
};

/**
 * Fetch a project by ID
 * @param id Project ID
 * @returns Project or null if not found
 */
export const fetchProjectById = async (id: string): Promise<ProjectDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    return null;
  }
};

/**
 * Create a new project
 * @param projectData Project data
 * @returns Created project or null on error
 */
export const createProject = async (projectData: ProjectCreateInput): Promise<ProjectDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select();
      
    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating project:', error);
    return null;
  }
};

/**
 * Update an existing project
 * @param id Project ID
 * @param projectData Project data to update
 * @returns Updated project or null on error
 */
export const updateProject = async (id: string, projectData: ProjectUpdateInput): Promise<ProjectDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    return null;
  }
};

/**
 * Delete a project
 * @param id Project ID
 * @returns Success boolean
 */
export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    return false;
  }
};
