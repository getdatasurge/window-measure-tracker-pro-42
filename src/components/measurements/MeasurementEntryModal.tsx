
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Measurement } from '@/types/measurement';
import { useMeasurementFormStorage } from '@/hooks/useMeasurementFormStorage';
import { generateNewMeasurement } from '@/utils/measurementUtils';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { MeasurementModalProps, MeasurementFormState } from './modal/types';
import MeasurementModalHeader from './modal/MeasurementModalHeader';
import MeasurementModalContent from './modal/MeasurementModalContent';
import MeasurementModalFooter from './modal/MeasurementModalFooter';

const MeasurementEntryModal: React.FC<MeasurementModalProps> = ({
  isOpen,
  onOpenChange,
  measurement,
  onSave,
  mode,
  defaultValues = {}
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState<MeasurementFormState>(measurement || generateNewMeasurement(defaultValues));
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [currentStep, setCurrentStep] = useState(1);
  const { user, profile } = useAuth();
  const { toast } = useToast();
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
        const now = new Date().toISOString();
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
  
  const handleSave = async () => {
    // Validate form
    const newErrors: {[key: string]: string} = {};
    
    // Required fields validation
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }
    
    // If errors exist, show them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Navigate to the tab with errors
      if (newErrors.location || newErrors.projectId) {
        setActiveTab('details');
        setCurrentStep(1);
      }
      
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Update the timestamp 
      const updatedMeasurement = {
        ...formData,
        updatedAt: new Date().toISOString(),
        updatedBy: profile?.full_name || 'Unknown User'
      };

      // If we have a user ID, save it in recorded_by for database
      if (user?.id) {
        // This is separated from updatedMeasurement to avoid including in the UI form data
        // It will be used when inserting/updating in the database
        updatedMeasurement.recorded_by = user.id;
      }
  
      // Save to localStorage for future use
      saveFormData(formData);
  
      // Mark as submitted
      setFormSubmitted(true);
  
      // Send back to parent component
      // This needs to be awaited to ensure sequential operations
      await onSave(updatedMeasurement);
      
      // Only close modal after save completes
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving measurement:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the measurement. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  // Calculate area when width or height changes
  useEffect(() => {
    if (formData.width && formData.height) {
      const width = parseFloat(formData.width);
      const height = parseFloat(formData.height);
      if (!isNaN(width) && !isNaN(height)) {
        // Convert to square feet
        const area = width * height / 144;
        updateFormData('area', `${area.toFixed(2)} ft²`);
      }
    }
  }, [formData.width, formData.height]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden bg-zinc-900 border border-zinc-800 text-white max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full flex flex-col h-full max-h-[90vh]"
        >
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-zinc-900">
            <MeasurementModalHeader 
              mode={mode}
              formData={formData}
              onClose={() => onOpenChange(false)}
            />
          </div>
          
          {/* Scrollable Content Area */}
          <MeasurementModalContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            setErrors={setErrors}
          />

          {/* Fixed Footer */}
          <div className="sticky bottom-0 z-10 bg-zinc-900">
            <MeasurementModalFooter
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              formData={formData}
              isSaving={isSaving}
              onPrevious={handlePreviousStep}
              onNext={handleNextStep}
              onCancel={() => onOpenChange(false)}
              onSave={handleSave}
            />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementEntryModal;
