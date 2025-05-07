
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useProjectList() {
  const [projectsList, setProjectsList] = useState<{id: string, name: string}[]>([]);
  
  // Fetch projects for dropdown
  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
        
      if (error) throw error;
      
      if (data) {
        setProjectsList(data);
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
