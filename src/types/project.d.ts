
// Re-export types from project-types.ts to maintain backward compatibility
import { ProjectOption, ProjectDetails, ProjectCreateInput, ProjectUpdateInput } from './project-types';

export {
  ProjectOption,
  ProjectDetails,
  ProjectCreateInput,
  ProjectUpdateInput
};

// Export existing Project-related types
export * from './project';
