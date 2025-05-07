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
  initialProjectName
}: UseAddMeasurementFormProps) => {
  const { refetchMeasurements } = useMeasurements();
  const { photoFiles, photoErrors, uploadProgress, handleFileChange, removePhoto, uploadPhotos, resetPhotoState } = usePhotoUpload();
  const { isSubmitting, setIsSubmitting, handleSubmission } = useFormSubmission();
  const { projectsList, fetchProjects } = useProjectList();
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<MeasurementFormData>({
    defaultValues: {
      projectId: initialProjectId || '',
      projectName: initialProjectName || '',
      location: '',
      width: '',
      height: '',
      direction: 'N/A' as Direction,
      notes: '',
      filmRequired: true,
      quantity: 1,
      photos: []
    }
  });
  
  // Set initial project value based on props or localStorage
  useEffect(() => {
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
  }, [initialProjectId, initialProjectName, setValue]);
  
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
      
      // Submit the form data with the photo URLs
      await handleSubmission(data, photoUrls, async () => {
        // Reset form state
        resetPhotoState();
        
        // Refetch measurements to update UI
        await refetchMeasurements();
        
        // Reset form and close modal
        reset();
        onSuccess();
      });
      
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
