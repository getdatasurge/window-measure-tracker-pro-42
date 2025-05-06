
import React from 'react';
import { usePromptLogs } from './usePromptLogs';
import DialogView from '@/components/activity/DialogView';
import SheetView from '@/components/activity/SheetView';
import InlineView from '@/components/activity/InlineView';
import { PromptViewerVariant } from '@/types/activity';

interface PromptHistoryViewerProps {
  variant?: PromptViewerVariant;
  maxHeight?: string;
}

const PromptHistoryViewer: React.FC<PromptHistoryViewerProps> = ({
  variant = 'dialog',
  maxHeight = '70vh'
}) => {
  const { isLoading, error, logEntries, dailyLogs } = usePromptLogs();
  
  if (variant === 'dialog') {
    return (
      <DialogView
        isLoading={isLoading}
        error={error}
        logEntries={logEntries}
        dailyLogs={dailyLogs}
      />
    );
  } else if (variant === 'sheet') {
    return (
      <SheetView
        isLoading={isLoading}
        error={error}
        logEntries={logEntries}
        dailyLogs={dailyLogs}
      />
    );
  } else {
    // Inline variant
    return (
      <InlineView
        isLoading={isLoading}
        error={error}
        logEntries={logEntries}
        dailyLogs={dailyLogs}
        maxHeight={maxHeight}
      />
    );
  }
};

export default PromptHistoryViewer;
