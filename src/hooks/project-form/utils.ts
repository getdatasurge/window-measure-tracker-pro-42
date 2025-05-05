
import { ProjectFormData } from '@/types/project';

/**
 * Helper function to merge defaultFormData with provided default values
 */
export function mergeDefaultValues(baseData: ProjectFormData, overrides: Partial<ProjectFormData>): ProjectFormData {
  // Create a deep copy of the base data
  const result: ProjectFormData = JSON.parse(JSON.stringify(baseData));
  
  // Handle top-level properties with type safety
  if (overrides.name !== undefined) result.name = overrides.name;
  if (overrides.type !== undefined) result.type = overrides.type;
  if (overrides.status !== undefined) result.status = overrides.status;
  if (overrides.description !== undefined) result.description = overrides.description;
  if (overrides.estimatedWindows !== undefined) result.estimatedWindows = overrides.estimatedWindows;
  if (overrides.instructions !== undefined) result.instructions = overrides.instructions;
  if (overrides.tags !== undefined) result.tags = overrides.tags;
  if (overrides.priority !== undefined) result.priority = overrides.priority;
  if (overrides.budgetEstimate !== undefined) result.budgetEstimate = overrides.budgetEstimate;
  
  // Handle nested objects with explicit type safety
  if (overrides.location) {
    result.location = {
      ...result.location,
      ...(overrides.location as NonNullable<ProjectFormData['location']>)
    };
  }
  
  if (overrides.timeline) {
    result.timeline = {
      ...result.timeline,
      ...(overrides.timeline as NonNullable<ProjectFormData['timeline']>)
    };
  }
  
  if (overrides.team) {
    result.team = {
      ...result.team,
      ...(overrides.team as NonNullable<ProjectFormData['team']>)
    };
  }
  
  if (overrides.attachments) {
    result.attachments = {
      ...result.attachments,
      ...(overrides.attachments as NonNullable<ProjectFormData['attachments']>)
    };
  }
  
  return result;
}

/**
 * Validate all required fields in the project form
 */
export function validateProjectForm(formData: ProjectFormData): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};
  
  // Required fields validation
  if (!formData.name) errors['name'] = 'Project name is required';
  if (!formData.type) errors['type'] = 'Project type is required';
  if (!formData.location?.addressLine1) errors['location.addressLine1'] = 'Address is required';
  if (!formData.location?.city) errors['location.city'] = 'City is required';
  if (!formData.location?.state) errors['location.state'] = 'State is required';
  if (!formData.location?.zip) errors['location.zip'] = 'ZIP code is required';
  if (!formData.timeline?.startDate) errors['timeline.startDate'] = 'Start date is required';
  if (!formData.team?.projectManager) errors['team.projectManager'] = 'Project manager is required';
  
  return errors;
}
