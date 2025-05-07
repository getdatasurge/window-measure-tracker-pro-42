
import React from 'react';
import MeasurementTabs from '../MeasurementTabs';
import { ModalContentProps } from './types';

const MeasurementModalContent: React.FC<ModalContentProps> = ({ 
  activeTab, 
  setActiveTab, 
  formData, 
  updateFormData,
  errors,
  setErrors
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <MeasurementTabs 
        activeTab={activeTab as any} 
        setActiveTab={setActiveTab as any}
        formData={formData} 
        updateFormData={updateFormData as any}
        errors={errors}
        setErrors={setErrors}
      />
    </div>
  );
};

export default MeasurementModalContent;
