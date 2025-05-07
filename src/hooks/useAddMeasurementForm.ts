import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMeasurements } from '@/hooks/useMeasurements';
import { usePhotoUpload } from './measurements/usePhotoUpload';
import { useFormSubmission } from './measurements/useFormSubmission';
import { MeasurementFormData, UseAddMeasurementFormProps } from './measurements/types';
import { useAreaCalculation } from './measurements/useAreaCalculation';
import { useFormInitialization } from './measurements/useFormInitialization';
import { useProjectManagement } from './measurements/useProjectManagement';
import { useMeasurementFormStorage } from './useMeasurementFormStorage';

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
  const { calculatedArea, calculateArea } = useAreaCalculation();
  const { saveFormData, initialFormData, clearSavedForm } = useMeasurementFormStorage();
  
  // Get form initialization helpers
  const { hasSavedDraft, getDefaultValues } = useFormInitialization({
    editMode,
    measurementToEdit,
    initialFormData,
    initialProjectId,
    initialProjectName,
    setValue: (field, value) => setValue(field, value)
  });
  
  // Create the form with react-hook-form
  const { register, handleSubmit, setValue, watch, reset, formState } = useForm<MeasurementFormData>({
    defaultValues: getDefaultValues()
  });
  
  // Get project management helpers
  const { projectsList, fetchProjects, handleProjectChange } = useProjectManagement({
    setValue
  });
  
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
  
  // Submit form handler
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
    errors: formState.errors,
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
