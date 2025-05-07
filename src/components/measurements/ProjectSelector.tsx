
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProjectSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectSelect: (projectId: string) => void;
}

export function ProjectSelector({ open, onOpenChange, onProjectSelect }: ProjectSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select a Project</h2>
          <p className="text-sm text-muted-foreground">
            Choose a project to view its measurements
          </p>
          <div className="flex flex-col space-y-2">
            {/* In a real implementation, these would be fetched from your API */}
            <Button variant="outline" onClick={() => onProjectSelect('project-1')}>
              Main Street Windows
            </Button>
            <Button variant="outline" onClick={() => onProjectSelect('project-2')}>
              Downtown Office Complex
            </Button>
            <Button variant="outline" onClick={() => onProjectSelect('project-3')}>
              Residential Tower
            </Button>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
