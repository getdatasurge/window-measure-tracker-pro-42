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
    fetchProjects: rawFetchProjects,
    handleProject
