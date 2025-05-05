
import React from 'react';
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { notify } from '@/utils/toast-utils';

interface ModalFooterProps {
  onSubmit: () => void;
  submitButtonText?: string;
  currentStep: number;
  totalSteps: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  isLastStep: boolean;
  isSubmitting?: boolean;
  showSaveDraft?: boolean;
  onSaveDraft?: () => void;
  draftSaved?: boolean;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ 
  onSubmit, 
  submitButtonText = "Create Project",
  currentStep,
  totalSteps,
  onNextStep,
  onPrevStep,
  isLastStep,
  isSubmitting = false,
  showSaveDraft = false,
  onSaveDraft,
  draftSaved = false
}) => {
  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft();
      notify.info('Draft saved successfully');
    }
  };
  
  return (
    <div className="flex justify-between p-6 border-t border-zinc-800 bg-zinc-900/80 sticky bottom-0 left-0 right-0 w-full">
      <div className="flex items-center">
        {showSaveDraft && onSaveDraft ? (
          <Button 
            variant="ghost" 
            onClick={handleSaveDraft} 
            className="text-xs text-zinc-500 hover:text-zinc-400"
            disabled={draftSaved}
          >
            {draftSaved ? 'Draft saved' : 'Save as draft'}
          </Button>
        ) : (
          <p className="text-xs text-zinc-500">* Required fields</p>
        )}
      </div>
      <div className="flex gap-2">
        <DialogClose asChild>
          <Button variant="outline" className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white">
            Cancel
          </Button>
        </DialogClose>
        
        {currentStep > 0 && (
          <Button 
            onClick={onPrevStep}
            className="bg-zinc-700 text-white hover:bg-zinc-600"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        
        {!isLastStep ? (
          <Button 
            onClick={onNextStep}
            className="bg-zinc-600 text-white hover:bg-zinc-500"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={onSubmit}
            className="bg-green-500 text-white hover:bg-green-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : submitButtonText}
            {!isSubmitting && <Check className="h-4 w-4 ml-2" />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ModalFooter;
