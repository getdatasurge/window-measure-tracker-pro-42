
// Re-export types from project-types.ts to maintain backward compatibility
import { ProjectOption, ProjectDetails, ProjectCreateInput, ProjectUpdateInput } from './project-types';

// Export these types for backward compatibility
export {
  ProjectOption,
  ProjectDetails,
  ProjectCreateInput,
  ProjectUpdateInput
};

// Export existing Project-related types
export * from './project';
