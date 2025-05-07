
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define ProjectOption type explicitly here to avoid circular references
export interface ProjectOption {
  id: string;
  name: string;
}

// Define explicit return type to prevent circular references
export function useProjectList(): {
  projectsList: ProjectOption[];
  fetchProjects: () => Promise<void>;
} {
  const [projectsList, setProjectsList] = useState<ProjectOption[]>([]);
  
  // Fetch projects for dropdown
  const fetchProjects = useCallback(async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
        
      if (error) throw error;
      
      if (data) {
        setProjectsList(data as ProjectOption[]);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  }, []);

  return {
    projectsList,
    fetchProjects
  };
}
