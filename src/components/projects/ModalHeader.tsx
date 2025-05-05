
import React from 'react';
import { DialogClose } from "@/components/ui/dialog";
import { Folder, X } from "lucide-react";

interface ModalHeaderProps {
  projectId: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ projectId }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
      <div className="flex items-center gap-2">
        <Folder className="h-5 w-5 text-green-500" />
        <div>
          <h2 className="text-lg font-semibold">Create New Project</h2>
          <p className="text-sm text-zinc-400">ID: {projectId} | Fill in the project details below</p>
        </div>
      </div>
      <DialogClose className="p-1 rounded-md hover:bg-zinc-800">
        <X className="h-4 w-4" />
      </DialogClose>
    </div>
  );
};

export default ModalHeader;
