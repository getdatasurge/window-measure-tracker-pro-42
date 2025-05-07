import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the exact shape expected from Supabase query
type RawProject = {
  id: string;
  name: string;
};

export function useProjectList() {
  const [projectsList, setProjectsList] = useState<RawProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) {
        setError(error);
        setProjectsList([]);
        return;
      }

      if (data) {
        setProjectsList(data);
      }

      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  return {
    projectsList,
    isLoading,
    error,
  };
}
