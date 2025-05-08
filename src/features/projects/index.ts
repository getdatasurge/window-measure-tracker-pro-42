
/**
 * Projects feature module
 * 
 * This module provides functionality for managing projects in the application.
 * In public mode, it provides read-only access to project data.
 */

// Re-export components and hooks
export * from './api';
export * from './types';

// Export default mock project for public mode
export const DEFAULT_PUBLIC_PROJECT = {
  id: 'public-project',
  name: 'Sample Project',
  client: 'Public Demo',
  location: 'Demo Location',
  status: 'active' as const,
  createdAt: new Date().toISOString(),
};
