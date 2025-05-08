
import { useState, useEffect, useCallback } from 'react';

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
      // Mock implementation - no Supabase
      console.log('Mock fetchProjects called');
      
      // TODO: Replace with actual implementation
      setProjectsList([
        { id: 'mock-1', name: 'Mock Project 1' },
        { id: 'mock-2', name: 'Mock Project 2' }
      ]);
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
