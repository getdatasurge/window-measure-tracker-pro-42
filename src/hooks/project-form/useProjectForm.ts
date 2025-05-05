
import { useState, useEffect } from 'react';
import { ProjectFormData } from '@/types/project';
import { toast } from '@/hooks/use-toast';
import { defaultFormData } from './default-data';
import { mergeDefaultValues, validateProjectForm } from './utils';
import { UseProjectFormProps, UseProjectFormReturn } from './types';

const DRAFT_STORAGE_KEY = 'project_form_draft';

/**
 * Custom hook for managing project form state and interactions
 */
export function useProjectForm({ onCreateProject, onClose, defaultValues }: UseProjectFormProps): UseProjectFormReturn {
  const [activeTab, setActiveTab] = useState('project-info');
  const [formData, setFormData] = useState<ProjectFormData>(() => {
    // Try to load saved draft from localStorage
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft) as ProjectFormData;
      } catch (e) {
        console.error('Error parsing saved draft:', e);
      }
    }
    
    // Fall back to default form data with any provided default values
    if (defaultValues) {
      return mergeDefaultValues(defaultFormData, defaultValues);
    }
    return defaultFormData;
  });
  
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [draftSaved, setDraftSaved] = useState(false);
  
  // Generate a random project ID for display
  const projectId = `PRJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Reset form when modal opens
  const resetForm = () => {
    // Remove any saved draft
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    
    // Apply default values when resetting the form
    if (defaultValues) {
      setFormData(mergeDefaultValues(defaultFormData, defaultValues));
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
    setActiveTab('project-info');
    setDraftSaved(false);
  };
  
  const updateFormData = (field: string, value: any) => {
    console.log(`Updating field: ${field} with value:`, value);
    setDraftSaved(false);
    
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
  
  const saveDraft = () => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
      setDraftSaved(true);
      toast({
        title: "Draft Saved",
        description: "Your project draft has been saved locally.",
      });
    } catch (e) {
      console.error('Error saving draft:', e);
      toast({
        title: "Error Saving Draft",
        description: "Could not save your draft. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // Call the onCreateProject callback with the form data
      onCreateProject?.(formData);
      
      // Remove draft on successful submission
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      
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

  return {
    activeTab,
    setActiveTab,
    formData,
    errors,
    projectId,
    resetForm,
    updateFormData,
    handleSubmit,
    draftSaved,
    saveDraft,
  };
}
