
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import MeasurementTabsNav from './components/MeasurementTabsNav';
import MeasurementTabsContent from './components/MeasurementTabsContent';
import { useTabNavigation } from './hooks/useTabNavigation';
import { MeasurementFormData } from '@/hooks/measurements/types';
import { Measurement } from '@/types/measurement';

interface MeasurementTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: MeasurementFormData;
  updateFormData: (field: string, value: any) => void;
  errors?: {[key: string]: string};
  setErrors?: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
}

const MeasurementTabs: React.FC<MeasurementTabsProps> = ({
  activeTab,
  setActiveTab,
  formData,
  updateFormData,
  errors = {},
  setErrors = () => {}
}) => {
  // Use our custom hook for tab navigation
  const { enhancedUpdateFormData } = useTabNavigation({
    setActiveTab,
    formData,
    setErrors,
    errors
  });
  
  // Create an enhanced updateFormData function that combines the original
  // function with our enhancedUpdateFormData for field tracking
  const handleFormDataUpdate = (field: string, value: any) => {
    // Call the original updateFormData from props
    updateFormData(field, value);
    
    // Call our enhanced version that tracks fields and handles auto-advance
    enhancedUpdateFormData(field, value);
    
    // Clear error when user starts typing
    if (errors[field]) {
      const newErrors = {...errors};
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  // Cast formData to Measurement to ensure compatibility with MeasurementTabsContent
  // We need to ensure the id property exists since it's required in Measurement
  const formDataAsMeasurement = {
    ...formData,
    id: formData.id || 'temp-id', // Use a temporary ID if none exists
    measurementDate: formData.measurementDate || new Date().toISOString(),
    filmRequired: formData.filmRequired !== undefined ? formData.filmRequired : true,
  } as Measurement;

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <MeasurementTabsNav activeTab={activeTab} />
      <MeasurementTabsContent 
        activeTab={activeTab}
        formData={formDataAsMeasurement} 
        updateFormData={handleFormDataUpdate}
        errors={errors}
        setErrors={setErrors}
      />
    </Tabs>
  );
};

export default MeasurementTabs;
