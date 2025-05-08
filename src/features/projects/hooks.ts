
/**
 * React hooks for project management
 */

import { useState, useCallback, useEffect } from 'react';
import { Project } from './types';
import { fetchProjects, fetchProjectById, createProject, updateProject, deleteProject } from './api';
import { useOfflineCache } from '../../hooks/useOfflineCache';
import { useSyncQueue } from '../../hooks/useSyncQueue';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface UseProjectsState {
  projects: Project[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for managing projects with offline support
 */
export function useProjects() {
  const [state, setState] = useState<UseProjectsState>({
    projects: [],
    loading: true,
    error: null,
  });
  
  const { isOnline, wasOffline } = useOnlineStatus();
  const projectsCache = useOfflineCache<Project>('projects');
  const { processQueue } = useSyncQueue();
  
  // Fetch projects with offline fallback
  const getProjects = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const projects = await fetchProjects();
      setState({ projects, loading: false, error: null });
    } catch (error) {
      setState({ 
        projects: [], 
        loading: false, 
        error: error instanceof Error ? error : new Error('Failed to fetch projects') 
      });
    }
  }, []);
  
  // Create a new project with offline support
  const addProject = useCallback(async (projectData: Omit<Project, 'id'>) => {
    try {
      const newProject = await createProject(projectData);
      setState(prev => ({
        ...prev,
        projects: [...prev.projects, newProject]
      }));
      return newProject;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }, []);
  
  // Update a project with offline support
  const editProject = useCallback(async (id: string, data: Partial<Project>) => {
    try {
      const updatedProject = await updateProject(id, data);
      
      // Update the local state
      setState(prev => ({
        ...prev,
        projects: prev.projects.map(p => 
          p.id === id ? updatedProject : p
        )
      }));
      
      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }, []);
  
  // Remove a project with offline support
  const removeProject = useCallback(async (id: string) => {
    try {
      const success = await deleteProject(id);
      
      if (success) {
        // Remove from local state
        setState(prev => ({
          ...prev,
          projects: prev.projects.filter(p => p.id !== id)
        }));
      }
      
      return success;
    } catch (error) {
      console.error('Error removing project:', error);
      throw error;
    }
  }, []);
  
  // Load initial data
  useEffect(() => {
    getProjects();
  }, [getProjects]);
  
  // Process sync queue when coming back online
  useEffect(() => {
    if (isOnline && wasOffline) {
      console.log('Back online - processing sync queue');
      processQueue().then(result => {
        console.log('Sync queue processing result:', result);
        if (result.processed > 0) {
          // Refresh the projects list if any operations were processed
          getProjects();
        }
      });
    }
  }, [isOnline, wasOffline, processQueue, getProjects]);
  
  return {
    ...state,
    getProjects,
    addProject,
    editProject,
    removeProject,
    isOnline
  };
}

/**
 * Hook for getting a single project by ID
 */
export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const getProject = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProjectById(projectId);
      setProject(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch project'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);
  
  useEffect(() => {
    getProject();
  }, [getProject]);
  
  return { project, loading, error, refreshProject: getProject };
}
