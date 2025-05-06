
import React from 'react';
import MeasurementEntryModal from './MeasurementEntryModal';
import { Measurement } from '@/types/measurement';

interface EditMeasurementModalProps {
  measurement: Measurement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (measurement: Measurement) => void;
  defaultValues?: Partial<Measurement>;
}

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
