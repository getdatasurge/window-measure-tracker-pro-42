
import { MeasurementFormState } from '../types';

export function useFormValidation() {
  const validateForm = (formData: MeasurementFormState) => {
    const newErrors: {[key: string]: string} = {};
    
    // Required fields validation
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }
    
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
  };
  
  return { validateForm };
}
