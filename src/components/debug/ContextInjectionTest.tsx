
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BeakerIcon } from 'lucide-react';
import { WindowAction } from './types';

interface ContextInjectionTestProps {
  actions: WindowAction[];
  logPromptResponse: (prompt: string, response: string) => void;
}

const ContextInjectionTest: React.FC<ContextInjectionTestProps> = ({ actions, logPromptResponse }) => {
  const [prompt, setPrompt] = useState<string>('Summarize the available window actions');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTest = () => {
    setIsLoading(true);
    
    // Simulate a test response
    setTimeout(() => {
      const actionSummary = actions.length > 0
        ? `Found ${actions.length} actions across ${new Set(actions.map(a => a.type)).size} categories.`
        : 'No actions available.';
        
      const testResponse = `Here's a summary of window actions:\n\n${actionSummary}\n\nCategories include: ${Array.from(new Set(actions.map(a => a.type))).join(', ')}`;
      
      setResponse(testResponse);
      logPromptResponse(prompt, testResponse);
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BeakerIcon className="h-5 w-5" />
          <span>Context Injection Test</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Test Prompt</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a test prompt..."
            className="min-h-[100px]"
          />
        </div>
        
        {response && (
          <div>
            <label className="text-sm font-medium mb-1 block">Response</label>
            <div className="border rounded-lg p-3 bg-slate-50">
              <pre className="whitespace-pre-wrap text-sm">{response}</pre>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTest} 
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? 'Testing...' : 'Run Test'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContextInjectionTest;
