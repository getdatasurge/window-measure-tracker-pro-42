
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { WindowAction } from '@/lib/parseWindowActions';

interface ContextInjectionTestProps {
  actions: WindowAction[];
  logPromptResponse: (prompt: string, response: string, contextSummary?: string) => Promise<any>;
}

const ContextInjectionTest: React.FC<ContextInjectionTestProps> = ({ actions, logPromptResponse }) => {
  const [testPrompt, setTestPrompt] = React.useState<string>('');
  const [simulatedContext, setSimulatedContext] = React.useState<string>('');

  const generateContextSimulation = () => {
    if (!testPrompt.trim()) {
      setSimulatedContext('Please enter a test prompt first.');
      return;
    }
    
    // Generate a simple context based on actions
    const relevantActions = actions.slice(0, 3); // Just use first 3 for demo
    const contextSummary = relevantActions.map(action => 
      `${action.type}: ${action.label} [${action.timestamp}]`
    ).join('\n');
    
    const simulatedPrompt = `
## User Prompt
${testPrompt}

## Knowledge Context
${contextSummary}

## System Instructions
Respond to the user based on the knowledge context provided.
`;
    
    setSimulatedContext(simulatedPrompt);
    
    // Log this test prompt if enabled
    logPromptResponse(
      testPrompt,
      "This is a simulated response for testing purposes only.",
      contextSummary
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Context Injection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Test Prompt</label>
            <Textarea 
              placeholder="Enter a test prompt..."
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <Button onClick={generateContextSimulation}>
            Simulate Context Injection
          </Button>
          
          <div>
            <label className="text-sm font-medium">Simulated System Prompt</label>
            <ScrollArea className="h-[200px] w-full rounded border p-4 bg-slate-50 mt-1">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {simulatedContext || 'Generated context will appear here...'}
              </pre>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContextInjectionTest;
