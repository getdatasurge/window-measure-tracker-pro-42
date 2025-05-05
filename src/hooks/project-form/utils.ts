
import { ProjectFormData } from '@/types/project';

/**
 * Helper function to merge defaultFormData with provided default values
 */
export function mergeDefaultValues(baseData: ProjectFormData, overrides: Partial<ProjectFormData>): ProjectFormData {
  const result = { ...baseData };
  
  // Handle top-level properties
  Object.keys(overrides).forEach((key) => {
    const typedKey = key as keyof ProjectFormData;
    const value = overrides[typedKey];
    
    if (value !== undefined) {
      // Handle nested objects separately
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Create a type-safe copy of the nested object
        const baseValue = result[typedKey];
        if (typeof baseValue === 'object' && baseValue !== null && !Array.isArray(baseValue)) {
          // Handle nested object merging with proper typing
          result[typedKey] = {
            ...(baseValue as object),
            ...(value as object)
          } as any; // Type assertion needed for the nested object
        } else {
          // If the base value is not an object, override completely
          result[typedKey] = value as any;
        }
      } else {
        // For non-object values, assign directly
        result[typedKey] = value as any;
      }
    }
  });
  
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
