
import { useState, useEffect } from 'react';
import { ProjectFormData } from '@/types/project';
import { toast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';

// Default form data for a new project
export const defaultFormData: ProjectFormData = {
  name: '',
  type: '',
  status: 'Planned',
  description: '',
  
  location: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
  },
  
  timeline: {
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    completionDate: '',
  },
  
  team: {
    projectManager: '',
    installers: [],
  },
  estimatedWindows: 0,
  instructions: '',
  
  attachments: {
    blueprints: [],
    photos: [],
    contracts: [],
  },
  tags: [],
  priority: 'Medium',
  budgetEstimate: 0,
};

export interface UseProjectFormProps {
  onCreateProject?: (data: ProjectFormData) => void;
  onClose: () => void;
  defaultValues?: Partial<ProjectFormData>;
}

export function useProjectForm({ onCreateProject, onClose, defaultValues }: UseProjectFormProps) {
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

  // Helper function to merge defaultFormData with provided default values
  function mergeDefaultValues(baseData: ProjectFormData, overrides: Partial<ProjectFormData>): ProjectFormData {
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
            result[typedKey] = {
              ...baseValue,
              ...(value as any)
            };
          } else {
            // If the base value is not an object, override completely
            result[typedKey] = value as any;
          }
        } else {
          result[typedKey] = value as any;
        }
      }
    });
    
    return result;
  }
  
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
        // Create a proper copy of the nested object, checking for null/undefined
        const updatedParent = { ...(prev[parent as keyof ProjectFormData] || {}) } as Record<string, any>;
        
        // Update the specific field
        updatedParent[child] = value;
        
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
    const newErrors: Partial<Record<string, string>> = {};
    
    // Required fields validation
    if (!formData.name) newErrors['name'] = 'Project name is required';
    if (!formData.type) newErrors['type'] = 'Project type is required';
    if (!formData.location?.addressLine1) newErrors['location.addressLine1'] = 'Address is required';
    if (!formData.location?.city) newErrors['location.city'] = 'City is required';
    if (!formData.location?.state) newErrors['location.state'] = 'State is required';
    if (!formData.location?.zip) newErrors['location.zip'] = 'ZIP code is required';
    if (!formData.timeline?.startDate) newErrors['timeline.startDate'] = 'Start date is required';
    if (!formData.team?.projectManager) newErrors['team.projectManager'] = 'Project manager is required';
    
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
