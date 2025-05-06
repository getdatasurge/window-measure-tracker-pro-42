
export interface PromptLogEntry {
  id: string;
  timestamp: string;
  prompt: string;
  response: string;
  contextSummary?: string;
}

export interface DailyLogs {
  [date: string]: PromptLogEntry[];
}

export type PromptViewerVariant = 'dialog' | 'sheet' | 'inline';
