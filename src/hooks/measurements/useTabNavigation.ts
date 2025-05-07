
// First, let's update the useTabNavigation hook to properly handle MeasurementFormData
import { useState, useEffect } from 'react';
import { MeasurementFormData } from './types';

interface UseTabNavigationProps {
  setActiveTab: (tab: string) => void;
  formData: MeasurementFormData;
  setErrors: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
  errors: {[key: string]: string};
}

export const useTabNavigation = ({
  setActiveTab,
  formData,
  setErrors,
  errors
}: UseTabNavigationProps) => {
  // Track which fields have been filled in each tab
  const [filledFields, setFilledFields] = useState<{[key: string]: boolean}>({});
  
  // Enhanced update function that tracks filled fields
  const enhancedUpdateFormData = (field: string, value: any) => {
    // Mark this field as filled if it has a value
    if (value !== undefined && value !== null && value !== '') {
      setFilledFields(prev => ({
        ...prev,
        [field]: true
      }));
    } else {
      // If the field is cleared, mark it as unfilled
      setFilledFields(prev => {
        const newState = { ...prev };
        delete newState[field];
        return newState;
      });
    }
    
    // Check if we should auto-advance to the next tab
    const detailsFields = ['projectId', 'location'];
    const dimensionsFields = ['width', 'height', 'direction'];
    const attributesFields = ['filmRequired', 'quantity', 'notes'];
    
    // If all required details fields are filled, advance to dimensions tab
    if (field === 'location' && formData.projectId && value) {
      setActiveTab('dimensions');
    }
    
    // If all required dimensions fields are filled, advance to attributes tab
    if (field === 'height' && formData.width && value) {
      setActiveTab('attributes');
    }
  };
  
  return {
    filledFields,
    enhancedUpdateFormData
  };
};
