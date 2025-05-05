
import { ProjectFormData } from '@/types/project';

/**
 * Helper function to merge defaultFormData with provided default values
 */
export function mergeDefaultValues(baseData: ProjectFormData, overrides: Partial<ProjectFormData>): ProjectFormData {
  // Create a deep copy of the base data to avoid mutations
  const result = JSON.parse(JSON.stringify(baseData)) as ProjectFormData;
  
  // Handle top-level properties
  Object.keys(overrides).forEach((key) => {
    const typedKey = key as keyof ProjectFormData;
    const value = overrides[typedKey];
    
    if (value !== undefined) {
      // Handle nested objects separately
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Handle nested object merging for specific known properties
        if (typedKey === 'location' || typedKey === 'timeline' || typedKey === 'team' || typedKey === 'attachments') {
          // These are known object properties that can be safely merged
          const baseValue = result[typedKey];
          
          if (typeof baseValue === 'object' && baseValue !== null && !Array.isArray(baseValue)) {
            // Type assertion for each specific property to help TypeScript
            if (typedKey === 'location') {
              result.location = { ...baseValue, ...value };
            } 
            else if (typedKey === 'timeline') {
              result.timeline = { ...baseValue, ...value };
            }
            else if (typedKey === 'team') {
              result.team = { ...baseValue, ...value };
            }
            else if (typedKey === 'attachments') {
              result.attachments = { ...baseValue, ...value };
            }
          } else {
            // Direct assignment for the full object
            result[typedKey] = value;
          }
        } else {
          // For other object properties, direct assignment
          result[typedKey] = value;
        }
      } else {
        // For non-object values, assign directly
        result[typedKey] = value;
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
