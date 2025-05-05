import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Measurement } from '@/data/measurementsData';
import MeasurementTabs from './MeasurementTabs';
import ModalFooter from './ModalFooter';
import { useMeasurementFormStorage } from '@/hooks/useMeasurementFormStorage';
import { generateNewMeasurement } from '@/utils/measurementUtils';
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
        setFormData(generateNewMeasurement(defaultValues));
      } else if (initialFormData) {
        // If we have data from localStorage, use that
        const now = new Date().toISOString();
        setFormData({
          ...generateNewMeasurement(),
          ...initialFormData
        });
      } else {
        // Start fresh
        setFormData(generateNewMeasurement());
      }

      // Reset the form submission state
      setFormSubmitted(false);
      // Always start at the first tab when opening the modal
      setActiveTab('details');
    }
  }, [isOpen, measurement, defaultValues, initialFormData]);
  const handleSave = () => {
    // Update the timestamp 
    const updatedMeasurement = {
      ...formData,
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage for future use
    saveFormData(formData);

    // Mark as submitted
    setFormSubmitted(true);

    // Send back to parent component
    onSave(updatedMeasurement);
    onOpenChange(false);
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
  return <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden bg-zinc-900 border border-zinc-800 text-white">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold flex justify-between items-center">
            <div>
              {mode === 'edit' ? 'Edit Measurement' : 'New Measurement'}
            </div>
            
          </DialogTitle>
          {mode === 'edit' && <DialogDescription className="text-zinc-400 text-sm">
              ID: {formData.id} | Project: {formData.projectName}
            </DialogDescription>}
        </DialogHeader>

        <MeasurementTabs activeTab={activeTab} setActiveTab={setActiveTab} formData={formData} updateFormData={updateFormData} />

        <ModalFooter measurement={formData} onCancel={() => onOpenChange(false)} onSave={handleSave} />
      </DialogContent>
    </Dialog>;
};
export default MeasurementEntryModal;