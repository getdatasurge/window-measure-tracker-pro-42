
// Export custom hooks
export * from "./use-toast";
export * from "./useMeasurementUpdate";
export * from "./useMeasurements";
export * from "./useDebounce";
export * from "./useErrorBoundary";
export * from "./useProjectsWithErrorHandling"; // Keep this export for backward compatibility
export * from "./useOnlineStatus";
export * from "./useOfflineCache";
export * from "./useSyncQueue";

// Re-export from features for backward compatibility
export * from "../features/measurements/hooks";

// Export from projects hooks
export { useProjects, useProject } from "../features/projects/hooks";

// Export from error handling utilities
export { tryAsync, withErrorHandling } from '@/utils/error-handling/index';
