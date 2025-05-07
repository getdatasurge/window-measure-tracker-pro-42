
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useMeasurementFormStorage } from '@/hooks/useMeasurementFormStorage';
import { generateNewMeasurement } from '@/utils/measurementUtils';
import { MeasurementFormState } from '../types';
import { Measurement } from '@/types/measurement';

interface UseMeasurementModalStateProps {
  isOpen: boolean;
  measurement?: Measurement;
  defaultValues?: Partial<Measurement>;
}

export function useMeasurementModalState({
  isOpen,
  measurement,
  defaultValues = {}
}: UseMeasurementModalStateProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState<MeasurementFormState>({} as MeasurementFormState);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [currentStep, setCurrentStep] = useState(1);
  const { user, profile } = useAuth();
  
  const TOTAL_STEPS = 5;

  // Use our custom hook for localStorage management
  const {
    initialFormData,
    saveFormData
  } = useMeasurementFormStorage(isOpen, defaultValues);

  // Load initial data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (measurement) {
        // If editing an existing measurement, use that
        setFormData(measurement);
      } else if (Object.keys(defaultValues).length > 0) {
        // If we have default values from context, use those
        setFormData(generateNewMeasurement({
          ...defaultValues,
          recordedBy: profile?.full_name || 'Unknown User'
        }));
      } else if (initialFormData) {
        // If we have data from localStorage, use that
        setFormData({
          ...generateNewMeasurement(),
          ...initialFormData,
          recordedBy: profile?.full_name || initialFormData.recordedBy || 'Unknown User'
        });
      } else {
        // Start fresh
        setFormData(generateNewMeasurement({
          recordedBy: profile?.full_name || 'Unknown User'
        }));
      }

      // Reset the form submission state
      setFormSubmitted(false);
      // Always start at the first tab when opening the modal
      setActiveTab('details');
      setCurrentStep(1);
      setErrors({});
    }
  }, [isOpen, measurement, defaultValues, initialFormData, profile]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Navigation functions
  const handleNextStep = () => {
    // Basic validation for current step
    if (currentStep === 1) {
      // Validate location
      if (!formData.location?.trim()) {
        setErrors({...errors, location: 'Location is required'});
        return;
      }
      
      // Validate project
      if (!formData.projectId) {
        setErrors({...errors, projectId: 'Project is required'});
        return;
      }
    }
    
    // If validation passes, go to next step
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
      
      // Map steps to tabs
      switch(currentStep + 1) {
        case 2:
          setActiveTab('dimensions');
          break;
        case 3:
          setActiveTab('status');
          break;
        case 4:
          setActiveTab('attributes');
          break;
        case 5:
          setActiveTab('photos');
          break;
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      
      // Map steps to tabs
      switch(currentStep - 1) {
        case 1:
          setActiveTab('details');
          break;
        case 2:
          setActiveTab('dimensions');
          break;
        case 3:
          setActiveTab('status');
          break;
        case 4:
          setActiveTab('attributes');
          break;
      }
    }
  };

  return {
    activeTab,
    setActiveTab,
    formData,
    setFormData,
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
}
