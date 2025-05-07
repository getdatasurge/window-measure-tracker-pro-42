
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
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        formData={formData} 
        updateFormData={updateFormData}
        errors={errors}
        setErrors={setErrors}
      />
    </div>
  );
};

export default MeasurementModalContent;
