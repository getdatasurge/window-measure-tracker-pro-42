
/**
 * Projects feature module
 * 
 * This module provides functionality for managing projects in the application.
 * Supports offline-first architecture with local caching and sync queue.
 */

// Re-export components and hooks
export * from './api';
export * from './types';
export * from './hooks';

// Export default mock project for public mode
export { DEFAULT_PUBLIC_PROJECT } from './api';
