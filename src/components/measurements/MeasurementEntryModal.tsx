
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Measurement } from '@/types/measurement';
import MeasurementTabs from './MeasurementTabs';
import { useMeasurementFormStorage } from '@/hooks/useMeasurementFormStorage';
import { generateNewMeasurement } from '@/utils/measurementUtils';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

type MeasurementEntryModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  measurement?: Measurement;
  onSave: (measurement: Measurement) => void;
  mode: 'create' | 'edit';
  defaultValues?: Partial<Measurement>;
};

const MeasurementEntryModal: React.FC<MeasurementEntryModalProps> = ({
  isOpen,
  onOpenChange,
  measurement,
  onSave,
  mode,
  defaultValues = {}
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState<Measurement>(measurement || generateNewMeasurement(defaultValues));
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

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
    }
  }, [isOpen, measurement, defaultValues, initialFormData, profile]);
  
  const handleSave = async () => {
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
      onSave(updatedMeasurement);
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
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div>
                <h2 className="text-lg font-semibold">{mode === 'edit' ? 'Edit Measurement' : 'New Measurement'}</h2>
                {mode === 'edit' && <p className="text-sm text-zinc-400">
                  ID: {formData.id} | Project: {formData.projectName}
                </p>}
              </div>
              <button 
                className="p-1 rounded-md hover:bg-zinc-800"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <MeasurementTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              formData={formData} 
              updateFormData={updateFormData}
            />
          </div>

          {/* Fixed Footer */}
          <div className="sticky bottom-0 z-10 bg-zinc-900">
            <div className="flex justify-between items-center border-t border-zinc-800 p-6">
              <div className="text-xs text-zinc-500">
                Last updated: {new Date(formData.updatedAt).toLocaleString()} by {formData.updatedBy || 'N/A'}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Submit Measurement'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementEntryModal;
