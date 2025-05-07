import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useProfile } from '@/contexts/profile';
import { MeasurementFormData } from '@/hooks/measurements/types';

interface UseMeasurementModalStateProps {
  isOpen: boolean;
  measurement?: MeasurementFormData;
  defaultValues?: Partial<MeasurementFormData>;
}

export const useMeasurementModalState = ({
  isOpen,
  measurement,
  defaultValues
}: UseMeasurementModalStateProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const TOTAL_STEPS = 3;
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'dimensions' | 'photos'>('details');
  const [formData, setFormData] = useState<MeasurementFormData>({
    id: measurement?.id || '',
    projectId: measurement?.projectId || '',
    projectName: measurement?.projectName || '',
    location: measurement?.location || '',
    width: measurement?.width || '',
    height: measurement?.height || '',
    direction: measurement?.direction || 'N/A',
    notes: measurement?.notes || '',
    filmRequired: measurement?.filmRequired !== false,
    quantity: measurement?.quantity || 1,
    status: measurement?.status || 'pending',
    photos: measurement?.photos || [],
    installationDate: measurement?.installationDate || '',
    input_source: measurement?.input_source || 'manual',
    ...defaultValues
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  useEffect(() => {
    if (measurement) {
      setFormData({
        id: measurement.id || '',
        projectId: measurement.projectId || '',
        projectName: measurement.projectName || '',
        location: measurement.location || '',
        width: measurement.width || '',
        height: measurement.height || '',
        direction: measurement.direction || 'N/A',
        notes: measurement.notes || '',
        filmRequired: measurement.film_required !== false,
        quantity: measurement.quantity || 1,
        status: measurement.status || 'pending',
        photos: measurement.photos || [],
        installationDate: measurement.installationDate || '',
        input_source: measurement.input_source || 'manual',
        ...defaultValues
      });
    } else if (defaultValues) {
      setFormData(prev => ({
        ...prev,
        ...defaultValues
      }));
    }
  }, [measurement, defaultValues]);
  
  const updateFormData = useCallback((key: keyof MeasurementFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  
  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  };
  
  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const saveFormData = (data: MeasurementFormData) => {
    localStorage.setItem('measurementFormData', JSON.stringify(data));
  };
  
  return {
    activeTab,
    setActiveTab,
    formData,
    updateFormData,
    formSubmitted,
    setFormSubmitted,
    isSaving,
    setIsSaving,
    errors,
    setErrors,
    currentStep,
    TOTAL_STEPS,
    handleNextStep,
    handlePreviousStep,
    user,
    profile,
    saveFormData
  };
};
