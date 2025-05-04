
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface SaveConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSaving: boolean;
}

const SaveConfirmDialog: React.FC<SaveConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isSaving,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Markdown File</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-700 mb-4">
            Are you sure you want to overwrite the existing markdown file on disk?
          </p>
          <p className="text-xs text-amber-600">
            This will replace the current content of window-tracker-prd.md
          </p>
        </div>
        <DialogFooter>
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Overwrite File'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveConfirmDialog;
