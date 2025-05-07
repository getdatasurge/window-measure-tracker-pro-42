import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMeasurements } from '@/hooks/useMeasurements';
import { usePhotoUpload } from './measurements/usePhotoUpload';
import { useFormSubmission } from './measurements/useFormSubmission';
import { useProjectList } from './measurements/useProjectList';
import { MeasurementFormData, UseAddMeasurementFormProps, FormErrors } from './measurements/types';
import { Direction } from '@/types/measurement';

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
  
  // Set up default values based on edit mode or new measurement
  const defaultValues = editMode && measurementToEdit 
    ? {
        projectId: measurementToEdit.projectId || '',
        projectName: measurementToEdit.projectName || '',
        location: measurementToEdit.location || '',
        width: measurementToEdit.width || '',
        height: measurementToEdit.height || '',
        direction: measurementToEdit.direction || ('N/A' as Direction),
        notes: measurementToEdit.notes || '',
        filmRequired: measurementToEdit.film_required !== false, // Default to true if undefined
        quantity: measurementToEdit.quantity || 1,
        photos: [],
        installationDate: measurementToEdit.installationDate || '',
        input_source: measurementToEdit.input_source || 'manual'
      }
    : {
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
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<MeasurementFormData>({
    defaultValues
  });
  
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
  }, [initialProjectId, initialProjectName, setValue, editMode, measurementToEdit]);
  
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
    errors: errors as FormErrors,
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
    reset
  };
};
