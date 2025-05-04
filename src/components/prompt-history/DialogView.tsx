
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import LogContent from './LogContent';
import { PromptLogEntry, DailyLogs } from './types';

interface DialogViewProps {
  isLoading: boolean;
  error: string | null;
  logEntries: PromptLogEntry[];
  dailyLogs: DailyLogs;
}

const DialogView: React.FC<DialogViewProps> = ({
  isLoading,
  error,
  logEntries,
  dailyLogs
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText size={16} />
          <span>Prompt History</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Prompt History</DialogTitle>
        </DialogHeader>
        <LogContent
          isLoading={isLoading}
          error={error}
          logEntries={logEntries}
          dailyLogs={dailyLogs}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DialogView;
