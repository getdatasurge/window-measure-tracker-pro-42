
import React from 'react';
import EditMeasurementModal from '../EditMeasurementModal';
import { Measurement } from '@/types/measurement';
import { MeasurementFormData } from '@/hooks/measurements/types';
import { Direction } from '@/constants/direction';

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

  // Ensure direction is a valid Direction type
  const validDirection = (measurement.direction as Direction) || 'N/A';

  // Pass the measurement directly to EditMeasurementModal which handles the conversion
  return (
    <EditMeasurementModal
      measurement={measurement}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSave={onSave}
    />
  );
};

export default MeasurementEditModalWrapper;
