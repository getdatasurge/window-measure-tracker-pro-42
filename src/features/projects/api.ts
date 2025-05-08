
/**
 * Project API functions
 * 
 * These functions handle project data operations, both online and offline.
 * In public mode, they provide simulated data instead of making actual API calls.
 */

import { Project, ProjectStatus } from './types';
import { DEFAULT_PUBLIC_PROJECT } from './index';

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

/**
 * Fetch all projects
 * In public mode, returns sample projects
 */
export async function fetchProjects(): Promise<Project[]> {
  // In a real implementation, this would make an API call if online,
  // or get data from the offline store if offline
  
  console.log('Fetching projects in public mode (simulated data)');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return sample projects
  return SAMPLE_PROJECTS;
}

/**
 * Fetch a project by ID
 * In public mode, returns a sample project or null if not found
 */
export async function fetchProjectById(id: string): Promise<Project | null> {
  // In public mode, look for a matching sample project
  
  console.log(`Fetching project with ID ${id} in public mode`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Look for a matching project
  const project = SAMPLE_PROJECTS.find(p => p.id === id);
  
  if (project) {
    return project;
  }
  
  // If no matching project is found, return the default public project
  return DEFAULT_PUBLIC_PROJECT;
}

/**
 * Create a new project
 * In public mode, this simulates creating a project without actually saving it
 */
export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  // In public mode, we don't actually create anything - just simulate it
  
  console.log('Creating project in public mode (simulated):', project);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a new project with a generated ID
  return {
    ...project,
    id: `public-project-${Date.now()}`,
    createdAt: new Date().toISOString(),
    entries_count: 0,
    status: (project.status || 'active') as ProjectStatus
  };
}

/**
 * Update a project
 * In public mode, this simulates updating a project without actually saving changes
 */
export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  console.log(`Updating project ${id} in public mode (simulated):`, data);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Find the project to update
  const existingProject = SAMPLE_PROJECTS.find(p => p.id === id) || DEFAULT_PUBLIC_PROJECT;
  
  // Return the "updated" project
  return {
    ...existingProject,
    ...data,
    id,
    // Ensure status is a valid ProjectStatus
    status: (data.status || existingProject.status) as ProjectStatus
  };
}

/**
 * Delete a project
 * In public mode, this simulates deleting a project without actually removing it
 */
export async function deleteProject(id: string): Promise<boolean> {
  console.log(`Deleting project ${id} in public mode (simulated)`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Always return success in public mode
  return true;
}
