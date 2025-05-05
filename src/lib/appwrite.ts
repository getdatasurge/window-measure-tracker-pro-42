import { Client, Account, Databases, ID, Query } from 'appwrite';

/**
 * @deprecated This module uses Appwrite and is deprecated.
 * Please use the Supabase client from '@/integrations/supabase/client' instead.
 */

// Initialize Appwrite client
const client = new Client();

// Try to use environment variables if available
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'windowtracker';

client
  .setEndpoint(endpoint)
  .setProject(projectId);

console.warn('The Appwrite client is deprecated and will be removed in a future version. Please use Supabase instead.');

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);

// Database and collection IDs
export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'default';
export const PROJECTS_COLLECTION_ID = 'projects';
export const MEASUREMENTS_COLLECTION_ID = 'measurements';
export const USERS_COLLECTION_ID = 'users';

// Project CRUD operations
export async function createProject(data: any) {
  try {
    return await databases.createDocument(
      DB_ID,
      PROJECTS_COLLECTION_ID,
      ID.unique(),
      data
    );
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function fetchProjects() {
  try {
    return await databases.listDocuments(DB_ID, PROJECTS_COLLECTION_ID);
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function fetchProjectById(id: string) {
  try {
    return await databases.getDocument(DB_ID, PROJECTS_COLLECTION_ID, id);
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    throw error;
  }
}

export async function updateProject(id: string, data: any) {
  try {
    return await databases.updateDocument(DB_ID, PROJECTS_COLLECTION_ID, id, data);
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    throw error;
  }
}

export async function deleteProject(id: string) {
  try {
    return await databases.deleteDocument(DB_ID, PROJECTS_COLLECTION_ID, id);
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw error;
  }
}

// Measurement CRUD operations
export async function createMeasurement(data: any) {
  try {
    return await databases.createDocument(
      DB_ID, 
      MEASUREMENTS_COLLECTION_ID, 
      ID.unique(), 
      data
    );
  } catch (error) {
    console.error('Error creating measurement:', error);
    throw error;
  }
}

export async function fetchMeasurements() {
  try {
    return await databases.listDocuments(DB_ID, MEASUREMENTS_COLLECTION_ID);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    throw error;
  }
}

// User role management
export async function getUserRole(userId: string) {
  try {
    const user = await databases.getDocument(DB_ID, USERS_COLLECTION_ID, userId);
    return user.role || 'user';
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return 'user'; // Default to user role if error
  }
}

// Export client for advanced usage if needed
export { client, ID, Query };
