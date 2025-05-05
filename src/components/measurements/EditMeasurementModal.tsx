
import React, { useState, useEffect } from 'react';
import MeasurementEntryModal from './MeasurementEntryModal';
import { Measurement } from '@/data/measurementsData';

interface EditMeasurementModalProps {
  measurement: Measurement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (measurement: Measurement) => void;
}

const EditMeasurementModal: React.FC<EditMeasurementModalProps> = ({
  measurement,
  open,
  onOpenChange,
  onSave,
}) => {
  return (
    <MeasurementEntryModal
      isOpen={open}
      onOpenChange={onOpenChange}
      measurement={measurement || undefined}
      onSave={onSave}
      mode={measurement ? 'edit' : 'create'}
    />
  );
};

export default EditMeasurementModal;
