
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define ProjectOption directly in this file to avoid circular imports
export interface ProjectOption {
  id: string;
  name: string;
}

export function useProjectList() {
  const [projectsList, setProjectsList] = useState<ProjectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .order('name');

      if (error) {
        throw error;
      }

      if (data) {
        setProjectsList(data.map(project => ({
          id: project.id,
          name: project.name
        })));
      }
    } catch (err) {
      const errorObject = err instanceof Error ? err : new Error('Failed to fetch projects');
      setError(errorObject);
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projectsList,
    isLoading,
    error,
    fetchProjects
  };
}
