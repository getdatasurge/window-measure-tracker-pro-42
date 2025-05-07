
import { useEffect, useCallback, useMemo } from 'react';
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
  const {
    photoFiles,
    photoErrors,
    uploadProgress,
    handleFileChange,
    removePhoto,
    uploadPhotos,
    resetPhotoState,
    setInitialPhotos
  } = usePhotoUpload();

  const { isSubmitting, setIsSubmitting, handleSubmission } = useFormSubmission();
  const { calculatedArea, calculateArea } = useAreaCalculation();
  const {
    saveFormData,
    initialFormData,
    clearSavedForm,
    hasSavedDraft
  } = useMeasurementFormStorage();

  const { getDefaultValues } = useFormInitialization({
    editMode,
    measurementToEdit,
    initialFormData,
    initialProjectId,
    initialProjectName,
    setValue: (field, value) => setValue(field, value)
  });

  const { register, handleSubmit, setValue, watch, reset, formState } = useForm<MeasurementFormData>({
    defaultValues: getDefaultValues()
  });

  const {
    projectsList,
    fetchProjects,
    handleProjectChange
  } = useProjectManagement({ setValue });
  
  // Save form data on change
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name && type === 'change') {
        saveFormData(value as MeasurementFormData);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, saveFormData]);
  
  // Fetch projects when component mounts
  useEffect(() => {
    if (fetchProjects) {
      fetchProjects();
    }
  }, [fetchProjects]);
  
  // Form submission handler
  const onSubmit = useCallback(async (data: MeasurementFormData) => {
    try {
      setIsSubmitting(true);
      
      // Upload photos if any
      const photoUrls = await uploadPhotos();
      
      // Call the submission handler from the form submission hook
      const result = await handleSubmission(data, photoUrls, onSuccess);
      
      // Clear saved form data on successful submission
      if (result) {
        clearSavedForm();
        resetPhotoState();
        refetchMeasurements();
      }
      
      return result;
    } catch (error) {
      console.error('Error submitting measurement form:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [uploadPhotos, handleSubmission, onSuccess, clearSavedForm, resetPhotoState, refetchMeasurements, setIsSubmitting]);
  
  // Return everything needed by the component
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
    hasSavedDraft,
    clearSavedForm
  };
};
