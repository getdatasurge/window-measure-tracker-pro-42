
import React from 'react';
import { X } from 'lucide-react';
import { ModalHeaderProps } from './types';

const MeasurementModalHeader: React.FC<ModalHeaderProps> = ({ mode, formData, onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
      <div>
        <h2 className="text-lg font-semibold">
          {mode === 'edit' ? 'Edit Measurement' : 
           `New Measurement${formData.projectName ? ` for ${formData.projectName}` : ''}`}
        </h2>
        {mode === 'edit' && <p className="text-sm text-zinc-400">
          ID: {formData.id} | Project: {formData.projectName}
        </p>}
      </div>
      <button 
        className="p-1 rounded-md hover:bg-zinc-800"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default MeasurementModalHeader;
