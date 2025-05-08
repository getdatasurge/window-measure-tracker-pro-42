
/**
 * Activity tracking feature module
 * 
 * This module provides functionality for tracking user activity in the application.
 * In public mode, activities are only stored locally and not sent to any server.
 */

// Re-export components and hooks
export * from './types';
export * from './api';
export * from './hooks';

// Re-export prompt history feature
export * from './prompt-history';
