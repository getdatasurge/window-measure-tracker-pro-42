
import { useState } from 'react';
import { ProjectsHookState, ProjectDetailState } from './types';
import { useFetchProjects } from './operations/fetchProjects';
import { useFetchProjectById } from './operations/fetchProjectById';
import { useCreateProject } from './operations/createProject';
import { useUpdateProject } from './operations/updateProject';
import { useDeleteProject } from './operations/deleteProject';

/**
 * Main hook for projects management with error handling
 */
export const useProjectsWithErrorHandling = () => {
  // Initialize state
  const [state, setState] = useState<ProjectsHookState>({
    projects: [],
    loading: false,
    error: null,
  });
  
  const [projectDetailState, setProjectDetailState] = useState<ProjectDetailState>({
    project: null,
    loading: false,
    error: null,
  });

  // Hook operations
  const fetchProjects = useFetchProjects(setState);
  const fetchProjectById = useFetchProjectById(setProjectDetailState);
  
  // Initialize these hooks with the fetchProjects function for refresh functionality
  const createProject = useCreateProject(setState, fetchProjects);
  const updateProject = useUpdateProject(setState, fetchProjects);
  const deleteProject = useDeleteProject(setState, fetchProjects);

  return {
    ...state,
    projectDetail: projectDetailState,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
  };
};

// Export the hook types
export * from './types';

// Export operation hooks for direct usage if needed
export {
  useFetchProjects,
  useFetchProjectById,
  useCreateProject,
  useUpdateProject,
  useDeleteProject
};
