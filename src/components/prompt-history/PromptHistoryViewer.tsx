
import React from 'react';
import { usePromptLogs } from './usePromptLogs';
import DialogView from './DialogView';
import SheetView from './SheetView';
import InlineView from './InlineView';
import { PromptViewerVariant } from './types';

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
