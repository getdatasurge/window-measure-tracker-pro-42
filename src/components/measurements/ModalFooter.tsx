
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Measurement } from '@/data/measurementsData';

interface ModalFooterProps {
  measurement: Measurement;
  onCancel: () => void;
  onSave: () => void;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  measurement,
  onCancel,
  onSave
}) => {
  return (
    <div className="flex justify-between items-center border-t border-zinc-800 p-6">
      <div className="text-xs text-zinc-500">
        Last updated: {format(new Date(measurement.updatedAt), 'MMM dd, yyyy h:mm a')} by {measurement.updatedBy}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white" 
          onClick={onSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ModalFooter;
