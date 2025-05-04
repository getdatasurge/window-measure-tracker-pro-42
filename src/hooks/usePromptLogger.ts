
import { useCallback } from 'react';

interface PromptLogOptions {
  enabled?: boolean;
}

/**
 * Hook for logging Lovable prompts and responses
 */
export function usePromptLogger(options: PromptLogOptions = {}) {
  const { enabled = process.env.NODE_ENV === 'development' || process.env.ENABLE_LOGGING === 'true' } = options;
  
  const logPromptResponse = useCallback(
    async (prompt: string, response: string, contextSummary?: string) => {
      if (!enabled || !prompt || !response) return;
      
      try {
        const payload = {
          prompt,
          response,
          timestamp: new Date().toISOString(),
          contextSummary: contextSummary || ''
        };
        
        const res = await fetch('http://localhost:3001/log-prompt-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          console.error('Failed to log prompt:', data.message);
        }
        
        return data;
      } catch (error) {
        console.error('Error logging prompt:', error);
      }
    },
    [enabled]
  );
  
  return { logPromptResponse };
}
