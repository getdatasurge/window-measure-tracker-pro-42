import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MeasurementModalProps } from './modal/types';
import MeasurementModalHeader from './modal/MeasurementModalHeader';
import MeasurementModalContent from './modal/MeasurementModalContent';
import MeasurementModalFooter from './modal/MeasurementModalFooter';
import { useMeasurementModalState } from './modal/hooks/useMeasurementModalState';
import { useFormValidation } from './modal/hooks/useFormValidation';

const MeasurementEntryModal: React.FC<MeasurementModalProps> = ({
  isOpen,
  onOpenChange,
  measurement,
  onSave,
  mode,
  defaultValues = {}
}) => {
  const { toast } = useToast();
  const { validateForm } = useFormValidation();
  
  const {
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
  } = useMeasurementModalState({
    isOpen,
    measurement,
    defaultValues
  });
  
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
  
  const handleSave = async () => {
    // Validate form
    const validation = validateForm(formData);
    
    // If errors exist, show them and stop submission
    if (!validation.isValid) {
      setErrors(validation.errors);
      
      // Navigate to the tab with errors
      if (validation.errors.location || validation.errors.projectId) {
        setActiveTab('details');
      }
      
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Update the timestamp 
      const updatedMeasurement = {
        ...formData,
        updatedAt: new Date().toISOString(),
        updatedBy: profile?.full_name || 'Unknown User',
        filmRequired: formData.filmRequired || true, // Ensure filmRequired is included
        photos: Array.isArray(formData.photos) ? formData.photos : [] // Ensure photos is properly formatted
      } as MeasurementFormData; // Add explicit type assertion
    
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
