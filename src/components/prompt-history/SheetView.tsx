
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import LogContent from './LogContent';
import { PromptLogEntry, DailyLogs } from './types';

interface SheetViewProps {
  isLoading: boolean;
  error: string | null;
  logEntries: PromptLogEntry[];
  dailyLogs: DailyLogs;
}

const SheetView: React.FC<SheetViewProps> = ({
  isLoading,
  error,
  logEntries,
  dailyLogs
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText size={16} />
          <span>Prompt History</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Prompt History</SheetTitle>
        </SheetHeader>
        <LogContent
          isLoading={isLoading}
          error={error}
          logEntries={logEntries}
          dailyLogs={dailyLogs}
        />
      </SheetContent>
    </Sheet>
  );
};

export default SheetView;
