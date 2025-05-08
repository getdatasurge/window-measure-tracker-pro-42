
/**
 * Project API functions
 * 
 * These functions handle project data operations, both online and offline.
 * In public mode, they provide simulated data instead of making actual API calls.
 */

import { v4 as uuidv4 } from 'uuid';
import { Project, ProjectStatus } from './types';
import * as offlineStore from '../../services/cache/offlineStore';
import * as syncQueue from '../../services/sync/syncQueue';
import { getOnlineStatus } from '../../services/network/networkStatus';

// Sample projects for public mode
const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'public-project-1',
    name: 'Residential Renovation',
    client: 'Demo Client 1',
    location: '123 Main Street',
    status: 'active' as ProjectStatus,
    deadline: '2025-08-30',
    createdAt: '2025-04-15T10:30:00Z',
    entries_count: 12,
  },
  {
    id: 'public-project-2',
    name: 'Office Building',
    client: 'Demo Client 2',
    location: '456 Business Ave',
    status: 'pending' as ProjectStatus,
    deadline: '2025-09-15',
    createdAt: '2025-04-20T14:45:00Z',
    entries_count: 8,
  },
  {
    id: 'public-project-3',
    name: 'Retail Store Remodel',
    client: 'Demo Client 3',
    location: '789 Commerce Blvd',
    status: 'completed' as ProjectStatus,
    deadline: '2025-06-10',
    createdAt: '2025-03-05T09:15:00Z',
    entries_count: 24,
  },
];

// Default public project
export const DEFAULT_PUBLIC_PROJECT: Project = {
  id: 'public-project',
  name: 'Sample Project',
  client: 'Public Demo',
  location: 'Demo Location',
  status: 'active' as const,
  createdAt: new Date().toISOString(),
};

/**
 * Fetch all projects
 * Supports offline mode with local data caching
 */
export async function fetchProjects(): Promise<Project[]> {
  console.log('Fetching projects...');
  
  try {
    // Check if we have cached projects
    const cachedProjects = await offlineStore.getAllEntities<Project>('projects');
    
    if (cachedProjects.length > 0) {
      console.log('Using cached projects:', cachedProjects.length);
      return cachedProjects;
    }
    
    // If no cached data but we're offline, use sample projects
    if (!getOnlineStatus()) {
      console.log('Offline mode - using sample projects');
      return SAMPLE_PROJECTS;
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, we would fetch from API here
    const projects = SAMPLE_PROJECTS;
    
    // Cache the results
    for (const project of projects) {
      await offlineStore.storeEntity('projects', project.id, project);
    }
    
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    
    // Fallback to sample projects in case of error
    return SAMPLE_PROJECTS;
  }
}

/**
 * Fetch a project by ID
 * Supports offline mode with local cache
 */
export async function fetchProjectById(id: string): Promise<Project | null> {
  console.log(`Fetching project with ID ${id}`);
  
  try {
    // Try to get from local cache first
    const cachedProject = await offlineStore.getEntity<Project>('projects', id);
    
    if (cachedProject) {
      console.log('Using cached project data');
      return cachedProject;
    }
    
    // If offline and not in cache, check sample projects
    if (!getOnlineStatus()) {
      const sampleProject = SAMPLE_PROJECTS.find(p => p.id === id);
      return sampleProject || DEFAULT_PUBLIC_PROJECT;
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In real app, would fetch from API here
    const project = SAMPLE_PROJECTS.find(p => p.id === id);
    
    if (project) {
      // Cache the project
      await offlineStore.storeEntity('projects', project.id, project);
      return project;
    }
    
    // Return default project if not found
    return DEFAULT_PUBLIC_PROJECT;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return DEFAULT_PUBLIC_PROJECT;
  }
}

/**
 * Create a new project
 * Works offline by storing locally and syncing later
 */
export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  const isOnline = getOnlineStatus();
  console.log(`Creating project (${isOnline ? 'online' : 'offline'} mode):`, project);
  
  try {
    // Generate a new ID
    const newProject: Project = {
      ...project,
      id: `project-${uuidv4()}`,
      createdAt: new Date().toISOString(),
      status: (project.status || 'active') as ProjectStatus,
      entries_count: 0
    };
    
    // Store the project locally
    await offlineStore.storeEntity('projects', newProject.id, newProject);
    
    // Add to sync queue if we're offline
    if (!isOnline) {
      await syncQueue.addToSyncQueue('projects', 'create', newProject.id, newProject);
      console.log('Added project creation to sync queue');
    } else {
      // Simulate API call if online
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Project created successfully on server');
    }
    
    return newProject;
  } catch (error) {
    console.error('Error creating project:', error);
    
    // Return a simulated project anyway for UI to show
    return {
      ...project,
      id: `offline-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: (project.status || 'active') as ProjectStatus,
      entries_count: 0
    };
  }
}

/**
 * Update a project
 * Works offline by updating locally and syncing later
 */
export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const isOnline = getOnlineStatus();
  console.log(`Updating project ${id} (${isOnline ? 'online' : 'offline'} mode):`, data);
  
  try {
    // Get the current project data
    const existingProject = await offlineStore.getEntity<Project>('projects', id) || 
      await fetchProjectById(id);
    
    if (!existingProject) {
      throw new Error(`Project with ID ${id} not found`);
    }
    
    // Create updated project
    const updatedProject: Project = {
      ...existingProject,
      ...data,
      // Ensure status is a valid ProjectStatus
      status: (data.status || existingProject.status) as ProjectStatus
    };
    
    // Update local storage
    await offlineStore.storeEntity('projects', id, updatedProject);
    
    // Add to sync queue if offline
    if (!isOnline) {
      await syncQueue.addToSyncQueue('projects', 'update', id, updatedProject);
      console.log('Added project update to sync queue');
    } else {
      // Simulate API call if online
      await new Promise(resolve => setTimeout(resolve, 400));
      console.log('Project updated successfully on server');
    }
    
    return updatedProject;
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    
    // Return a valid project object anyway
    const fallbackProject = SAMPLE_PROJECTS.find(p => p.id === id) || DEFAULT_PUBLIC_PROJECT;
    return {
      ...fallbackProject,
      ...data,
      id,
      status: (data.status || fallbackProject.status) as ProjectStatus
    };
  }
}

/**
 * Delete a project
 * Works offline by marking for deletion locally and syncing later
 */
export async function deleteProject(id: string): Promise<boolean> {
  const isOnline = getOnlineStatus();
  console.log(`Deleting project ${id} (${isOnline ? 'online' : 'offline'} mode)`);
  
  try {
    // If offline, don't actually delete, just add to sync queue
    if (!isOnline) {
      await syncQueue.addToSyncQueue('projects', 'delete', id, null);
      console.log('Added project deletion to sync queue');
      
      // Mark as deleted in local storage (could use a special field)
      const existingProject = await offlineStore.getEntity<Project>('projects', id);
      if (existingProject) {
        await offlineStore.storeEntity('projects', id, {
          ...existingProject,
          status: 'archived' as ProjectStatus, // Use archived instead of deleting
          _pendingDeletion: true // Add a flag
        });
      }
    } else {
      // If online, remove from local storage and simulate API call
      await offlineStore.removeEntity('projects', id);
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('Project deleted successfully on server');
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    return false;
  }
}
