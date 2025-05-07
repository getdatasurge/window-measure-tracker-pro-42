
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMeasurements } from '@/hooks/useMeasurements';
import { usePhotoUpload } from './measurements/usePhotoUpload';
import { useFormSubmission } from './measurements/useFormSubmission';
import { useProjectList } from './measurements/useProjectList';
import { MeasurementFormData, UseAddMeasurementFormProps, FormErrors } from './measurements/types';
import { Direction } from '@/types/measurement';
import { useMeasurementFormStorage } from '@/hooks/useMeasurementFormStorage';

export { MAX_FILE_SIZE, MAX_FILES } from './measurements/types';

export const useAddMeasurementForm = ({
  onSuccess,
  initialProjectId,
  initialProjectName,
  editMode = false,
  measurementToEdit
}: UseAddMeasurementFormProps) => {
  const { refetchMeasurements } = useMeasurements();
  const { photoFiles, photoErrors, uploadProgress, handleFileChange, removePhoto, uploadPhotos, resetPhotoState, setInitialPhotos } = usePhotoUpload();
  const { isSubmitting, setIsSubmitting, handleSubmission } = useFormSubmission();
  const { projectsList, fetchProjects } = useProjectList();
  
  // Set up session recovery through localStorage
  const { saveFormData, initialFormData, clearSavedForm } = useMeasurementFormStorage();
  
  // Derived area state
  const [calculatedArea, setCalculatedArea] = useState<string>('');
  
  // Session recovery prompt state
  const [hasSavedDraft, setHasSavedDraft] = useState<boolean>(false);
  
  // Set up default values based on edit mode, saved draft, or new measurement
  let defaultValues: Partial<MeasurementFormData> = {};
  
  if (editMode && measurementToEdit) {
    defaultValues = {
      projectId: measurementToEdit.projectId || '',
      projectName: measurementToEdit.projectName || '',
      location: measurementToEdit.location || '',
      width: measurementToEdit.width || '',
      height: measurementToEdit.height || '',
      direction: measurementToEdit.direction || 'N/A' as Direction,
      notes: measurementToEdit.notes || '',
      filmRequired: measurementToEdit.film_required !== false, // Default to true if undefined
      quantity: measurementToEdit.quantity || 1,
      photos: [],
      installationDate: measurementToEdit.installationDate || '',
      input_source: measurementToEdit.input_source || 'manual'
    };
  } else if (initialFormData) {
    // Convert string[] photos if needed
    const formPhotos = Array.isArray((initialFormData as any).photos) 
      ? (initialFormData as any).photos.filter((p: any) => p instanceof File) 
      : [];
      
    defaultValues = {
      ...initialFormData as Partial<MeasurementFormData>,
      projectId: initialProjectId || (initialFormData as any).projectId || '',
      projectName: initialProjectName || (initialFormData as any).projectName || '',
      photos: formPhotos,
      input_source: 'manual'
    };
  } else {
    defaultValues = {
      projectId: initialProjectId || '',
      projectName: initialProjectName || '',
      location: '',
      width: '',
      height: '',
      direction: 'N/A' as Direction,
      notes: '',
      filmRequired: true,
      quantity: 1,
      photos: [],
      input_source: 'manual'
    };
  }
  
  const { register, handleSubmit, setValue, watch, reset, formState } = useForm<MeasurementFormData>({
    defaultValues
  });
  
  // Check if there's a saved draft
  useEffect(() => {
    if (initialFormData && !editMode) {
      setHasSavedDraft(true);
    }
  }, [initialFormData, editMode]);
  
  // Auto-save form data as user types
  const formValues = watch();
  useEffect(() => {
    // Don't save empty forms or when editing
    if (editMode || !formValues.location) return;
    
    // Save form data to localStorage
    saveFormData(formValues);
  }, [formValues, saveFormData, editMode]);
  
  // Load photos if editing existing measurement
  useEffect(() => {
    if (editMode && measurementToEdit?.photos && measurementToEdit.photos.length > 0) {
      setInitialPhotos(measurementToEdit.photos);
    }
  }, [editMode, measurementToEdit, setInitialPhotos]);
  
  // Set initial project value based on props or localStorage
  useEffect(() => {
    // If editing, project values are already set
    if (editMode && measurementToEdit) return;
    
    // Set initial project if provided
    if (initialProjectId && initialProjectName) {
      setValue('projectId', initialProjectId);
      setValue('projectName', initialProjectName);
    } 
    // Use saved draft if available
    else if (initialFormData && (initialFormData as any).projectId && (initialFormData as any).projectName) {
      setValue('projectId', (initialFormData as any).projectId);
      setValue('projectName', (initialFormData as any).projectName);
    }
    // Set last used project if available
    else {
      const lastProject = localStorage.getItem('lastSelectedProject');
      if (lastProject) {
        try {
          const { id, name } = JSON.parse(lastProject);
          setValue('projectId', id);
          setValue('projectName', name);
        } catch (e) {
          console.error('Error parsing last project', e);
        }
      }
    }
  }, [initialProjectId, initialProjectName, setValue, editMode, measurementToEdit, initialFormData]);
  
  // Load last used fractional values from localStorage
  useEffect(() => {
    const lastWidthFraction = localStorage.getItem('lastWidthFraction');
    const lastHeightFraction = localStorage.getItem('lastHeightFraction');
    
    if (lastWidthFraction) {
      document.querySelectorAll('[data-width-fraction="' + lastWidthFraction + '"]').forEach(el => {
        (el as HTMLElement).classList.add('bg-zinc-700'); // Highlight the last used fraction
      });
    }
    
    if (lastHeightFraction) {
      document.querySelectorAll('[data-height-fraction="' + lastHeightFraction + '"]').forEach(el => {
        (el as HTMLElement).classList.add('bg-zinc-700'); // Highlight the last used fraction
      });
    }
  }, []);
  
  // Calculate area based on dimensions
  const calculateArea = useCallback((width: string, height: string, quantity: number = 1) => {
    if (!width || !height) {
      setCalculatedArea('');
      return;
    }
    
    // Parse numeric values
    const parseNumericValue = (value: string): number | null => {
      if (!value) return null;
      const numericStr = value.replace(/[^0-9.\/]/g, '');
      // Handle fractions like "36 1/2"
      if (numericStr.includes('/')) {
        const parts = numericStr.split('/');
        if (parts.length === 2) {
          return parseFloat(parts[0]) / parseFloat(parts[1]);
        }
        
        // Handle mixed numbers like "36 1/2"
        const spaceParts = numericStr.split(' ');
        if (spaceParts.length === 2) {
          const whole = parseFloat(spaceParts[0]);
          const fractionParts = spaceParts[1].split('/');
          if (fractionParts.length === 2) {
            return whole + (parseFloat(fractionParts[0]) / parseFloat(fractionParts[1]));
          }
        }
      }
      
      const parsed = parseFloat(numericStr);
      return isNaN(parsed) ? null : parsed;
    };
    
    const widthValue = parseNumericValue(width);
    const heightValue = parseNumericValue(height);
    
    if (widthValue && heightValue) {
      // Calculate area in square feet (converting from inches)
      const areaSqFt = (widthValue * heightValue * quantity) / 144;
      const formattedArea = `${areaSqFt.toFixed(2)} ft²`;
      
      // Update the calculated area state
      setCalculatedArea(formattedArea);
      
      // Set the area field value - update to use string value instead of number
      setValue('area', formattedArea);
    } else {
      setCalculatedArea('');
    }
  }, [setValue]);
  
  const handleProjectChange = (projectId: string) => {
    const selectedProject = projectsList.find(p => p.id === projectId);
    if (selectedProject) {
      setValue('projectId', selectedProject.id);
      setValue('projectName', selectedProject.name);
    }
  };
  
  const onSubmit = async (data: MeasurementFormData) => {
    setIsSubmitting(true);
    
    try {
      // Upload photos first
      let photoUrls: string[] = [];
      
      if (photoFiles.length > 0) {
        try {
          photoUrls = await uploadPhotos();
        } catch (err) {
          setIsSubmitting(false);
          return;
        }
      }
      
      // If we're editing, we need to include the existing photos that weren't changed
      if (editMode && measurementToEdit?.photos) {
        // Keep existing photos that weren't removed (if any)
        photoUrls = [...photoUrls, ...(measurementToEdit.photos || [])];
      }
      
      // Submit the form data with the photo URLs and measurement id if editing
      await handleSubmission(
        data,
        photoUrls,
        async () => {
          // Reset form state
          resetPhotoState();
          
          // Refetch measurements to update UI
          await refetchMeasurements();
          
          // Clear saved form data as it has been successfully submitted
          clearSavedForm();
          
          // Reset form and close modal
          reset();
          onSuccess();
        },
        editMode ? measurementToEdit?.id : undefined
      );
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    watch,
    setValue,
    errors: formState.errors as FormErrors,
    isSubmitting,
    projectsList,
    photoFiles,
    photoErrors,
    uploadProgress,
    onSubmit,
    handleProjectChange,
    handleFileChange,
    removePhoto,
    fetchProjects,
    reset,
    formState,
    calculateArea,
    calculatedArea,
    hasSavedDraft
  };
};
