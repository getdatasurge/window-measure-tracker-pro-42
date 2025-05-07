
import { useState, useCallback } from 'react';
import { Measurement } from '@/types/measurement';

interface UseTabNavigationProps {
  setActiveTab: (tab: string) => void;
  formData: Measurement;
  setErrors: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
  errors: {[key: string]: string};
}

export function useTabNavigation({
  setActiveTab,
  formData,
  setErrors,
  errors
}: UseTabNavigationProps) {
  // Track the last field that was modified in each tab
  const [lastModifiedFields, setLastModifiedFields] = useState<{[key: string]: string}>({});
  
  // Define the last field for each tab
  const tabLastFields = {
    details: 'recordedBy',
    dimensions: 'area',
    attributes: 'notes',
    photos: 'photos',
    status: 'reviewComments'
  };

  // Validate before advancing tabs
  const validateBeforeAdvance = useCallback((currentTab: string) => {
    // Validate required fields based on the current tab
    if (currentTab === 'details') {
      if (!formData.location || formData.location.trim() === '') {
        setErrors(prev => ({...prev, location: 'Location is required'}));
        return;
      }
      
      // If validation passes, advance to next tab
      setTimeout(() => setActiveTab('dimensions'), 300);
    } else if (currentTab === 'dimensions') {
      setTimeout(() => setActiveTab('attributes'), 300);
    } else if (currentTab === 'attributes') {
      setTimeout(() => setActiveTab('photos'), 300);
    } else if (currentTab === 'photos') {
      setTimeout(() => setActiveTab('status'), 300);
    }
  }, [formData, setActiveTab, setErrors]);
  
  // Simple validation function - expand as needed
  const isFieldValid = useCallback((field: string, value: any): boolean => {
    if (value === undefined || value === null || value === '') return false;
    
    if (field === 'width' || field === 'height') {
      return parseFloat(value) > 0;
    }
    
    if (field === 'quantity') {
      return parseInt(value) > 0;
    }
    
    return true;
  }, []);

  // Enhanced updateFormData that tracks last field modified
  const enhancedUpdateFormData = useCallback((field: string, value: any) => {
    // Determine which tab this field belongs to
    let currentTab = '';
    if (['projectId', 'projectName', 'location', 'measurementDate', 'recordedBy'].includes(field)) {
      currentTab = 'details';
    } else if (['width', 'height', 'area', 'quantity'].includes(field)) {
      currentTab = 'dimensions';
    } else if (['notes'].includes(field)) {
      currentTab = 'attributes';
    } else if (['photos'].includes(field)) {
      currentTab = 'photos';
    } else if (['status', 'reviewComments'].includes(field)) {
      currentTab = 'status';
    }
    
    if (currentTab) {
      setLastModifiedFields(prev => ({...prev, [currentTab]: field}));
    }
    
    // Auto-advance logic
    if (field === tabLastFields[currentTab]) {
      const isValidForAutoAdvance = isFieldValid(field, value);
      
      if (isValidForAutoAdvance) {
        validateBeforeAdvance(currentTab);
      }
    }
  }, [validateBeforeAdvance, isFieldValid, tabLastFields]);

  return {
    enhancedUpdateFormData,
    lastModifiedFields
  };
}
