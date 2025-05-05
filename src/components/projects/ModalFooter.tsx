
import React from 'react';
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ModalFooterProps {
  onSubmit: () => void;
  showSaveDraft?: boolean;
  submitButtonText?: string;
  onSaveDraft?: () => void;
  draftSaved?: boolean;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ 
  onSubmit, 
  showSaveDraft = false,
  submitButtonText = "Create Project",
  onSaveDraft,
  draftSaved = false
}) => {
  return (
    <div className="flex justify-between p-6 border-t border-zinc-800 bg-zinc-900/80">
      <div className="flex items-center gap-2">
        <p className="text-xs text-zinc-500">* Required fields</p>
        {draftSaved && (
          <span className="text-xs text-green-500">Draft saved</span>
        )}
      </div>
      <div className="flex gap-2">
        {showSaveDraft && onSaveDraft && (
          <Button 
            variant="outline" 
            className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            onClick={onSaveDraft}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        )}
        <DialogClose asChild>
          <Button variant="outline" className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white">
            Cancel
          </Button>
        </DialogClose>
        <Button 
          onClick={onSubmit}
          className="bg-green-500 text-white hover:bg-green-600"
        >
          {submitButtonText}
        </Button>
      </div>
    </div>
  );
};

export default ModalFooter;
