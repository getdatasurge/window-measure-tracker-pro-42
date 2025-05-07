
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectOption } from '@/hooks/measurements/types';

// Define explicit return type to break the circular reference
interface UseProjectListReturn {
  projectsList: ProjectOption[];
  fetchProjects: () => Promise<void>;
}

export function useProjectList(): UseProjectListReturn {
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
