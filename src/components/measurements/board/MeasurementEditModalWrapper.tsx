
import React from 'react';
import EditMeasurementModal from '../EditMeasurementModal';
import { Measurement } from '@/types/measurement';
import { MeasurementFormData } from '@/hooks/measurements/types';

interface MeasurementEditModalWrapperProps {
  measurement: Measurement | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: MeasurementFormData & { recorded_by?: string }) => Promise<void>;
}

const MeasurementEditModalWrapper: React.FC<MeasurementEditModalWrapperProps> = ({
  measurement,
  isOpen,
  onOpenChange,
  onSave
}) => {
  // We need to handle the case where the measurement is null
  if (!measurement) {
    return (
      <EditMeasurementModal
        measurement={null}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSave={onSave}
      />
    );
  }

  // Convert Measurement to include filmRequired property
  const enhancedMeasurement = {
    ...measurement,
    filmRequired: measurement.film_required !== false, // Ensure proper boolean conversion
    id: measurement.id // Ensure id is passed correctly
  };
  
  return (
    <EditMeasurementModal
      measurement={enhancedMeasurement as MeasurementFormData} // Use proper type assertion
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSave={onSave}
    />
  );
};

export default MeasurementEditModalWrapper;
