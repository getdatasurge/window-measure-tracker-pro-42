
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { CreateProjectModalProps } from '../projects/CreateProjectModal';
import { toast } from '@/components/ui/sonner';

interface DraftProjectListProps {
  openCreateProjectModal: (defaultValues?: any) => void;
}

const DraftProjectList: React.FC<DraftProjectListProps> = ({ openCreateProjectModal }) => {
  const [draft, setDraft] = useState<{
    data: any;
    timestamp: number;
    name: string;
  } | null>(null);

  // For simplicity, we're using a fixed user ID
  // In a real app, this would come from authentication context
  const userId = "user-1"; 
  const draftKey = `draft-project-${userId}`;

  useEffect(() => {
    // Check for saved drafts in localStorage
    const savedDraft = localStorage.getItem(draftKey);
    
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        if (parsedDraft.data && parsedDraft.timestamp) {
          setDraft(parsedDraft);
        }
      } catch (error) {
        console.error('Failed to parse draft:', error);
      }
    }
  }, [draftKey]);

  const handleResumeDraft = () => {
    if (draft) {
      openCreateProjectModal(draft.data);
    }
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(draftKey);
    setDraft(null);
    toast.success("Draft discarded");
  };

  if (!draft) return null;

  return (
    <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-white text-sm">Saved Project Draft</h3>
          <p className="text-xs text-zinc-400">
            Last saved {formatDistanceToNow(draft.timestamp)} ago
          </p>
        </div>
        
        <div className="p-3 border border-zinc-700 rounded-md bg-zinc-900/70 mb-3">
          <h4 className="text-sm font-medium text-white mb-1">
            {draft.name || "Unnamed Project"}
          </h4>
          <p className="text-xs text-zinc-400">
            Continue working on your draft project
          </p>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-zinc-400 hover:text-white hover:bg-zinc-700"
            onClick={handleDiscardDraft}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Discard Draft
          </Button>
          <Button 
            size="sm" 
            className="bg-green-500 text-white hover:bg-green-600"
            onClick={handleResumeDraft}
          >
            <FilePenLine className="h-4 w-4 mr-1" />
            Resume Draft
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DraftProjectList;
