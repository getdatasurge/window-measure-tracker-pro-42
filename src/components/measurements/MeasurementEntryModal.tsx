
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import MeasurementTabs from './MeasurementTabs';
import ModalFooter from './ModalFooter';
import { Measurement } from '@/data/measurementsData';

type MeasurementEntryModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  measurement?: Measurement;
  onSave: (measurement: Measurement) => void;
  mode: 'create' | 'edit';
  defaultValues?: Partial<Measurement>;
};

const LOCAL_STORAGE_KEY = 'lastMeasurementEntry';

const generateNewMeasurement = (defaultValues?: Partial<Measurement>): Measurement => {
  const now = new Date().toISOString();
  return {
    id: `WM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    projectId: defaultValues?.projectId || '',
    projectName: defaultValues?.projectName || '',
    location: defaultValues?.location || '',
    measurementDate: format(new Date(), 'yyyy-MM-dd'),
    recordedBy: defaultValues?.recordedBy || '',
    width: defaultValues?.width || '0"',
    height: defaultValues?.height || '0"',
    area: defaultValues?.area || '0 ft²',
    quantity: defaultValues?.quantity || 1,
    direction: defaultValues?.direction || 'N/A',
    notes: defaultValues?.notes || '',
    status: 'Pending',
    createdAt: now,
    updatedAt: now,
    updatedBy: 'Current User'
  };
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
  const [formData, setFormData] = useState<Measurement>(
    measurement || generateNewMeasurement(defaultValues)
  );
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Load initial data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (measurement) {
        // If editing an existing measurement, use that
        setFormData(measurement);
      } else if (Object.keys(defaultValues).length > 0) {
        // If we have default values from context, use those
        setFormData(generateNewMeasurement(defaultValues));
      } else {
        // Try to load previously saved data from localStorage
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            const now = new Date().toISOString();
            
            // Create a new measurement but use the saved values where applicable
            setFormData({
              ...generateNewMeasurement(),
              projectId: parsedData.projectId || '',
              projectName: parsedData.projectName || '',
              location: parsedData.location || '',
              recordedBy: parsedData.recordedBy || '',
              width: parsedData.width || '0"',
              height: parsedData.height || '0"',
              quantity: parsedData.quantity || 1,
              direction: parsedData.direction || 'N/A',
              notes: parsedData.notes || ''
            });
          } catch (error) {
            console.error('Failed to parse saved measurement data:', error);
            setFormData(generateNewMeasurement());
          }
        } else {
          // No saved data, start fresh
          setFormData(generateNewMeasurement());
        }
      }
      
      // Reset the form submission state
      setFormSubmitted(false);
    }
  }, [isOpen, measurement, defaultValues]);

  const handleSave = () => {
    // Update the timestamp 
    const updatedMeasurement = {
      ...formData,
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage for future use (excluding sensitive/unique fields)
    const dataToSave = {
      projectId: formData.projectId,
      projectName: formData.projectName,
      location: formData.location,
      recordedBy: formData.recordedBy,
      width: formData.width,
      height: formData.height,
      quantity: formData.quantity,
      direction: formData.direction,
      notes: formData.notes
    };
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    
    // Mark as submitted
    setFormSubmitted(true);
    
    // Send back to parent component
    onSave(updatedMeasurement);
    onOpenChange(false);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate area when width or height changes
  useEffect(() => {
    if (formData.width && formData.height) {
      const width = parseFloat(formData.width);
      const height = parseFloat(formData.height);
      
      if (!isNaN(width) && !isNaN(height)) {
        // Convert to square feet
        const area = (width * height) / 144;
        updateFormData('area', `${area.toFixed(2)} ft²`);
      }
    }
  }, [formData.width, formData.height]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden bg-zinc-900 border border-zinc-800 text-white">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold flex justify-between items-center">
            <div>
              {mode === 'edit' ? 'Edit Measurement' : 'New Measurement'}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="w-8 h-8 p-0 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          {mode === 'edit' && (
            <DialogDescription className="text-zinc-400 text-sm">
              ID: {formData.id} | Project: {formData.projectName}
            </DialogDescription>
          )}
        </DialogHeader>

        <MeasurementTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          formData={formData}
          updateFormData={updateFormData}
        />

        <ModalFooter 
          measurement={formData}
          onCancel={() => onOpenChange(false)}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementEntryModal;
