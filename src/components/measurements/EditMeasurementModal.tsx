
import React from 'react';
import MeasurementEntryModal from './MeasurementEntryModal';
import { Measurement } from '@/types/measurement';
import { MeasurementModalProps } from './modal/types';
import { MeasurementFormData } from '@/hooks/measurements/types';
import { Direction } from '@/constants/direction';

type EditMeasurementModalProps = Omit<MeasurementModalProps, 'mode'> & {
  measurement: MeasurementFormData | null;
};

const EditMeasurementModal: React.FC<EditMeasurementModalProps> = ({
  measurement,
  isOpen,
  onOpenChange,
  onSave,
  defaultValues = {}
}) => {
  return (
    <MeasurementEntryModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      measurement={measurement}
      onSave={onSave}
      mode={measurement ? 'edit' : 'create'}
      defaultValues={defaultValues}
    />
  );
};

export default EditMeasurementModal;
