
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

  // Convert Measurement to MeasurementFormData to ensure compatibility
  const formattedMeasurement: MeasurementFormData = {
    id: measurement.id,
    projectId: measurement.projectId || '',
    projectName: measurement.projectName || '',
    location: measurement.location || '',
    width: measurement.width || '',
    height: measurement.height || '',
    direction: measurement.direction as Direction || 'N/A',
    notes: measurement.notes || '',
    filmRequired: measurement.film_required !== false,
    quantity: measurement.quantity || 1,
    status: measurement.status || 'Pending',
    photos: Array.isArray(measurement.photos) ? measurement.photos : [],
    installationDate: measurement.installationDate || '',
    input_source: measurement.input_source || 'manual',
    updatedAt: measurement.updatedAt || new Date().toISOString(),
    updatedBy: measurement.updatedBy || '',
    recorded_by: measurement.recorded_by,
    recordedBy: measurement.recordedBy || '',
    area: measurement.area || '',
    measurementDate: measurement.measurementDate || new Date().toISOString()
  };

  // Pass the formatted measurement to EditMeasurementModal
  return (
    <EditMeasurementModal
      measurement={formattedMeasurement}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSave={onSave}
    />
  );
};

export default MeasurementEditModalWrapper;
