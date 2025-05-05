
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";

interface DraftPromptProps {
  onResume: () => void;
  onDiscard: () => void;
}

const DraftPrompt: React.FC<DraftPromptProps> = ({ onResume, onDiscard }) => {
  return (
    <div className="p-6 space-y-4">
      <Alert className="bg-zinc-800 border-zinc-700">
        <FileCheck className="h-5 w-5 text-green-500" />
        <AlertTitle className="font-semibold text-white">Saved draft available</AlertTitle>
        <AlertDescription className="text-zinc-400">
          Would you like to resume from your previous draft?
        </AlertDescription>
      </Alert>
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
          onClick={onDiscard}
        >
          Discard Draft
        </Button>
        <Button 
          onClick={onResume}
          className="bg-green-500 text-white hover:bg-green-600"
        >
          Resume Draft
        </Button>
      </div>
    </div>
  );
};

export default DraftPrompt;
