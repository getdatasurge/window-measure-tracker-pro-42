
import React from 'react';
import LogContent from './LogContent';
import { PromptLogEntry, DailyLogs } from './types';

interface InlineViewProps {
  isLoading: boolean;
  error: string | null;
  logEntries: PromptLogEntry[];
  dailyLogs: DailyLogs;
  maxHeight?: string;
}

const InlineView: React.FC<InlineViewProps> = ({
  isLoading,
  error,
  logEntries,
  dailyLogs,
  maxHeight
}) => {
  return (
    <div className="border rounded-lg bg-white">
      <div className="border-b p-4">
        <h2 className="text-lg font-medium">Prompt History</h2>
      </div>
      <LogContent
        isLoading={isLoading}
        error={error}
        logEntries={logEntries}
        dailyLogs={dailyLogs}
        maxHeight={maxHeight}
      />
    </div>
  );
};

export default InlineView;
