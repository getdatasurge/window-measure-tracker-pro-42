import { useState, useEffect, useCallback } from 'react';
import { Measurement } from '@/types/measurement';

interface UseTabNavigationProps {
  setActiveTab: (tab: string) => void;
  formData: Measurement;
  setErrors: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
  errors: {[key: string]: string};
}

interface TabNavigationResult {
  enhancedUpdateFormData: (field: string, value: any) => void;
}

interface FieldTabMapping {
  [key: string]: string;
}

export const useTabNavigation = ({
  setActiveTab,
  formData,
  setErrors,
  errors
}: UseTabNavigationProps): TabNavigationResult => {
  // Keep track of which fields have been visited
  const [visitedFields, setVisitedFields] = useState<Set<string>>(new Set());
  
  // Define which fields belong to which tabs
  const fieldToTabMapping: FieldTabMapping = {
    // Details tab fields
    'projectId': 'details',
    'location': 'details',
    'projectName': 'details',
    'recordedBy': 'details',
    'measurementDate': 'details',
    
    // Dimensions tab fields
    'width': 'dimensions',
    'height': 'dimensions',
    'depth': 'dimensions',
    'area': 'dimensions',
    
    // Attributes tab fields
    'direction': 'attributes',
    'notes': 'attributes',
    'filmRequired': 'attributes',
    'quantity': 'attributes',

    // Photos tab fields
    'photos': 'photos',
    
    // Status tab fields
    'status': 'status',
    'updatedBy': 'status',
    'updatedAt': 'status',
    'approvalBy': 'status',
    'reviewComments': 'status'
  };
  
  // Check if a tab is complete
  const isTabComplete = useCallback((tabName: string): boolean => {
    const tabFields = Object.entries(fieldToTabMapping)
      .filter(([_, tab]) => tab === tabName)
      .map(([field]) => field);
    
    // Details tab requires project and location
    if (tabName === 'details') {
      return !!formData.projectId && !!formData.location;
    }
    
    // Dimensions tab requires width and height
    if (tabName === 'dimensions') {
      return !!formData.width && !!formData.height;
    }
    
    // For other tabs, they're complete if any field is filled
    return tabFields.some(field => {
      const value = formData[field];
      if (field === 'direction') {
        // Direction is special - we consider it "filled" if it has a valid value
        return !!value && ['North', 'South', 'East', 'West', 'N/A'].includes(value);
      }
      return !!value;
    });
  }, [formData, fieldToTabMapping]);
  
  // Handle field updates and potentially auto-advance tabs
  const enhancedUpdateFormData = useCallback((field: string, value: any) => {
    // Mark this field as visited
    setVisitedFields(prev => {
      const newSet = new Set(prev);
      newSet.add(field);
      return newSet;
    });
    
    // Clear any errors for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
    
  }, [errors, setErrors]);
  
  return {
    enhancedUpdateFormData
  };
};
