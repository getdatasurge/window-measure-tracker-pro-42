
import React from 'react';
import MeasurementEntryModal from './MeasurementEntryModal';
import { Measurement } from '@/types/measurement';
import { MeasurementModalProps } from './modal/types';
import { MeasurementFormData } from '@/hooks/measurements/types';
import { Direction } from '@/constants/direction';

type EditMeasurementModalProps = Omit<MeasurementModalProps, 'mode'> & {
  measurement: Measurement | null;
};

const EditMeasurementModal: React.FC<EditMeasurementModalProps> = ({
  measurement,
  isOpen,
  onOpenChange,
  onSave,
  defaultValues = {}
}) => {
  // Convert Measurement to MeasurementFormData
  const formattedMeasurement = measurement ? {
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
  } : undefined;

  return (
    <MeasurementEntryModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      measurement={formattedMeasurement as Measurement} // Cast to ensure compatibility
      onSave={onSave}
      mode={measurement ? 'edit' : 'create'}
      defaultValues={defaultValues}
    />
  );
};

export default EditMeasurementModal;
