
import React from 'react';
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalFooterProps {
  onSubmit: () => void;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ onSubmit }) => {
  return (
    <div className="flex justify-between p-6 border-t border-zinc-800 bg-zinc-900/80">
      <p className="text-xs text-zinc-500">* Required fields</p>
      <div className="flex gap-2">
        <DialogClose asChild>
          <Button variant="outline" className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white">
            Cancel
          </Button>
        </DialogClose>
        <Button 
          onClick={onSubmit}
          className="bg-green-500 text-white hover:bg-green-600"
        >
          Create Project
        </Button>
      </div>
    </div>
  );
};

export default ModalFooter;
