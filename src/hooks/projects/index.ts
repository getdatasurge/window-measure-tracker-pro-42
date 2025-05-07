
import { useState, useCallback } from 'react';
import { ProjectsHookState, ProjectsHookReturn } from './types';
import { useFetchProjects } from './operations/fetchProjects';
import { useFetchProjectById } from './operations/fetchProjectById';
import { useCreateProject } from './operations/createProject';
import { useUpdateProject } from './operations/updateProject';
import { useDeleteProject } from './operations/deleteProject';

/**
 * Main hook for project operations with comprehensive error handling and resilience
 */
export function useProjectsWithErrorHandling(): ProjectsHookReturn {
  const [state, setState] = useState<ProjectsHookState>({
    loading: false,
    error: null,
    projects: [],
    selectedProject: null
  });
  
  // Create a memoized version of fetchProjects to avoid circular dependencies
  const fetchProjectsMemoized = useCallback(async (activeOnly = true) => {
    const fetchImpl = useFetchProjects(setState);
    return fetchImpl(activeOnly);
  }, []);
  
  // Initialize the operation hooks with setState and the memoized refresh function
  const fetchProjects = useFetchProjects(setState);
  const fetchProjectById = useFetchProjectById(setState);
  const createProject = useCreateProject(setState, fetchProjectsMemoized);
  const updateProject = useUpdateProject(setState, fetchProjectsMemoized);
  const deleteProject = useDeleteProject(setState, fetchProjectsMemoized);
  
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

// Re-export types for easier imports
export * from './types';
