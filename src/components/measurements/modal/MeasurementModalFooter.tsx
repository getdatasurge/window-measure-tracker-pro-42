
import React from 'react';
import { Button } from '@/components/ui/button';
import { ModalFooterProps } from './types';

const MeasurementModalFooter: React.FC<ModalFooterProps> = ({ 
  currentStep, 
  totalSteps, 
  formData, 
  isSaving, 
  onPrevious,
  onNext,
  onCancel,
  onSave
}) => {
  const isFinalStep = currentStep === totalSteps;
  const updatedAtString = formData.updatedAt || new Date().toISOString();
  const updatedByString = formData.updatedBy || 'Unknown User';
  
  return (
    <div className="flex justify-between items-center border-t border-zinc-800 p-6">
      <div className="text-xs text-zinc-500">
        Step {currentStep} of {totalSteps} | Last updated: {new Date(updatedAtString).toLocaleString()} by {updatedByString}
      </div>
      <div className="flex gap-2">
        {currentStep > 1 && (
          <Button 
            variant="outline"
            onClick={onPrevious}
            disabled={isSaving}
          >
            Back
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white" 
          onClick={isFinalStep ? onSave : onNext}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : (isFinalStep ? 'Submit Measurement' : 'Continue Entry')}
        </Button>
      </div>
    </div>
  );
};

export default MeasurementModalFooter;
