
import { useState, useEffect } from 'react';
import { ProjectFormData } from '@/types/project';
import { toast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { defaultFormData } from './default-data';
import { mergeDefaultValues, validateProjectForm } from './utils';
import { UseProjectFormProps, UseProjectFormReturn } from './types';

/**
 * Custom hook for managing project form state and interactions
 */
export function useProjectForm({ onCreateProject, onClose, defaultValues }: UseProjectFormProps): UseProjectFormReturn {
  const [activeTab, setActiveTab] = useState('project-info');
  const [formData, setFormData] = useState<ProjectFormData>(() => {
    // Check for saved draft in localStorage
    const savedDraft = localStorage.getItem('create-project-draft');
    
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        return parsedDraft;
      } catch (e) {
        console.error("Failed to parse saved draft:", e);
      }
    }
    
    // Merge default form data with any provided default values
    if (defaultValues) {
      return mergeDefaultValues(defaultFormData, defaultValues);
    }
    return defaultFormData;
  });
  
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  
  // Generate a random project ID for display
  const projectId = `PRJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Debounce form changes for autosave
  const debouncedFormData = useDebounce(formData, 300);
  
  // Autosave form data to localStorage
  useEffect(() => {
    localStorage.setItem('create-project-draft', JSON.stringify(debouncedFormData));
  }, [debouncedFormData]);
  
  // Reset form when modal opens
  const resetForm = (useSavedDraft: boolean = false) => {
    if (useSavedDraft) {
      const savedDraft = localStorage.getItem('create-project-draft');
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          setFormData(parsedDraft);
          return;
        } catch (e) {
          console.error("Failed to parse saved draft:", e);
        }
      }
    }
    
    // Apply default values when resetting the form
    if (defaultValues) {
      setFormData(mergeDefaultValues(defaultFormData, defaultValues));
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
    setActiveTab('project-info');
  };
  
  const updateFormData = (field: string, value: any) => {
    // Handle nested properties
    const fieldParts = field.split('.');
    
    if (fieldParts.length === 1) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      // Handle nested fields (e.g., 'location.addressLine1')
      const [parent, child] = fieldParts;
      
      setFormData(prev => {
        // Type the parent key properly
        const parentKey = parent as keyof ProjectFormData;
        // Get the parent object, ensuring it's treated as an object
        const parentObject = prev[parentKey] || {};
        
        // Create a new object to avoid mutation
        const updatedParent = typeof parentObject === 'object' ? { ...parentObject as object } : {};
        
        // Update the specific field
        (updatedParent as Record<string, any>)[child] = value;
        
        return {
          ...prev,
          [parent]: updatedParent
        };
      });
    }
    
    // Clear error when user updates a field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors = validateProjectForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // Call the onCreateProject callback with the form data
      onCreateProject?.(formData);
      
      // Clear the saved draft
      localStorage.removeItem('create-project-draft');
      
      // Close modal and show success message
      onClose();
      toast({
        title: "Project Created",
        description: `${formData.name} has been successfully created.`,
      });
    } else {
      // Show error message for validation failures
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      
      // Navigate to the first tab with errors
      if (errors.name || errors.type) {
        setActiveTab('project-info');
      } else if (errors['location.addressLine1'] || errors['location.city'] || 
                errors['location.state'] || errors['location.zip'] || 
                errors['timeline.startDate']) {
        setActiveTab('location-timeline');
      } else if (errors['team.projectManager']) {
        setActiveTab('team-requirements');
      }
    }
  };
  
  // Check if there's a saved draft
  const hasSavedDraft = (): boolean => {
    return localStorage.getItem('create-project-draft') !== null;
  };
  
  // Clear the saved draft
  const clearSavedDraft = (): void => {
    localStorage.removeItem('create-project-draft');
  };

  return {
    activeTab,
    setActiveTab,
    formData,
    errors,
    projectId,
    resetForm,
    updateFormData,
    handleSubmit,
    hasSavedDraft,
    clearSavedDraft
  };
}
