
import React from 'react';
import MeasurementEntryModal from './MeasurementEntryModal';
import { Measurement } from '@/types/measurement';
import { MeasurementModalProps } from './modal/types';
import { MeasurementFormData } from '@/hooks/measurements/types';

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
  // Convert Measurement to MeasurementFormData if needed
  const formattedMeasurement = measurement ? {
    ...measurement,
    photos: Array.isArray(measurement.photos) 
      ? measurement.photos 
      : [],
    filmRequired: measurement.film_required ?? true
  } as unknown as MeasurementFormData : undefined;

  return (
    <MeasurementEntryModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      measurement={formattedMeasurement}
      onSave={onSave}
      mode={measurement ? 'edit' : 'create'}
      defaultValues={defaultValues}
    />
  );
};

export default EditMeasurementModal;
