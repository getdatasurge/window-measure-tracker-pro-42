
import React from 'react';
import MeasurementEntryModal from './MeasurementEntryModal';
import { Measurement } from '@/types/measurement';
import { MeasurementModalProps } from './modal/types';

type EditMeasurementModalProps = Omit<MeasurementModalProps, 'mode'> & {
  measurement: Measurement | null;
};

const EditMeasurementModal: React.FC<EditMeasurementModalProps> = ({
  measurement,
  open,
  onOpenChange,
  onSave,
  defaultValues = {}
}) => {
  return (
    <MeasurementEntryModal
      isOpen={open}
      onOpenChange={onOpenChange}
      measurement={measurement || undefined}
      onSave={onSave}
      mode={measurement ? 'edit' : 'create'}
      defaultValues={defaultValues}
    />
  );
};

export default EditMeasurementModal;
