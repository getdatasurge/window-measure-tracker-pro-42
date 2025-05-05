
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
};

const generateNewMeasurement = (): Measurement => {
  const now = new Date().toISOString();
  return {
    id: `WM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    projectId: '',
    projectName: '',
    location: '',
    measurementDate: format(new Date(), 'yyyy-MM-dd'),
    recordedBy: '',
    width: '0"',
    height: '0"',
    area: '0 ft²',
    quantity: 1,
    direction: 'N/A',
    notes: '',
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
  mode
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState<Measurement>(
    measurement || generateNewMeasurement()
  );

  useEffect(() => {
    if (measurement) {
      setFormData(measurement);
    } else {
      setFormData(generateNewMeasurement());
    }
  }, [measurement, isOpen]);

  const handleSave = () => {
    // Update the timestamp 
    const updatedMeasurement = {
      ...formData,
      updatedAt: new Date().toISOString()
    };
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
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-zinc-900 border border-zinc-800 text-white">
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
