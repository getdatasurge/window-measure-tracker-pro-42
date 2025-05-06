
import { useState, useEffect } from 'react';
import { PromptLogEntry, DailyLogs } from '@/types/activity';

export const usePromptLogs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logEntries, setLogEntries] = useState<PromptLogEntry[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLogs>({});
  
  // Mock function to fetch logs - in a real app, this would call your API
  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock data for demonstration
      const mockEntries = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          prompt: 'How do I create a button component?',
          response: 'You can create a button using the Button component from shadcn/ui.',
          contextSummary: 'User was viewing the components documentation.'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          prompt: 'Create a login form with validation',
          response: 'Here is a login form with Zod validation...',
          contextSummary: 'User was working on the authentication feature.'
        }
      ];
      
      setLogEntries(mockEntries);
      
      // Group by date
      const entriesByDate: DailyLogs = {};
      mockEntries.forEach(entry => {
        const date = entry.timestamp.split('T')[0];
        if (!entriesByDate[date]) {
          entriesByDate[date] = [];
        }
        entriesByDate[date].push(entry);
      });
      
      setDailyLogs(entriesByDate);
    } catch (err) {
      setError('Failed to load prompt history.');
      console.error('Error loading prompt history:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLogs();
  }, []);
  
  return {
    isLoading,
    error,
    logEntries,
    dailyLogs,
    refetch: fetchLogs
  };
};
