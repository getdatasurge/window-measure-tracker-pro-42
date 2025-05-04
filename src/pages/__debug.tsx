import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, FileText, RefreshCw, Database } from 'lucide-react';
import { parseWindowActions, readMarkdownFile, WindowAction } from '@/lib/parseWindowActions';
import { useLiveFileSync } from '@/hooks/useLiveFileSync';
import { usePromptLogger } from '@/hooks/usePromptLogger';
import PromptHistoryViewer from '@/components/prompt-history';

const DebugPage: React.FC = () => {
  // Check if we're in dev mode
  const isDev = process.env.NODE_ENV === 'development';
  
  const [markdownSource, setMarkdownSource] = useState<string>('');
  const [parsedActions, setParsedActions] = useState<WindowAction[]>([]);
  const [testPrompt, setTestPrompt] = useState<string>('');
  const [simulatedContext, setSimulatedContext] = useState<string>('');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Use the live sync hook to get real-time updates
  const { actions, loading, error } = useLiveFileSync('/window-tracker-prd.md');
  
  // Get prompt logger
  const { logPromptResponse } = usePromptLogger({ enabled: true });
  
  // Load markdown source directly for preview
  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);
        const content = await readMarkdownFile('/window-tracker-prd.md');
        setMarkdownSource(content);
        
        // Also parse it directly (in addition to using livesync)
        const parsed = parseWindowActions(content);
        setParsedActions(parsed);
        
        setLastUpdated(new Date());
      } catch (err) {
        setFetchError(`Failed to load markdown: ${(err as Error).message}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarkdown();
  }, []);
  
  // Simulate context injection for a prompt
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
  
  // Handle manual refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const content = await readMarkdownFile('/window-tracker-prd.md?t=' + Date.now());
      setMarkdownSource(content);
      setParsedActions(parseWindowActions(content));
      setLastUpdated(new Date());
      setFetchError(null);
    } catch (err) {
      setFetchError(`Failed to refresh: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // If not in dev mode, show a warning
  if (!isDev) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Debug page is only available in development mode.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Knowledgebase Debug</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      {fetchError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>Raw Markdown Source</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded border p-4 bg-slate-50">
                <pre className="text-xs font-mono">
                  {isLoading ? 'Loading...' : markdownSource}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <span>Parsed Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tree">
                <TabsList className="mb-2">
                  <TabsTrigger value="tree">Tree View</TabsTrigger>
                  <TabsTrigger value="json">Raw JSON</TabsTrigger>
                </TabsList>
                
                <TabsContent value="tree">
                  <ScrollArea className="h-[400px] w-full rounded border p-4 bg-slate-50">
                    {loading ? (
                      <p>Loading actions...</p>
                    ) : error ? (
                      <p className="text-red-500">{error}</p>
                    ) : (
                      <div className="space-y-3">
                        {actions.map(action => (
                          <div key={action.id} className="border rounded p-2 bg-white">
                            <div className="font-semibold">{action.type}: {action.label}</div>
                            <div className="text-xs text-gray-500">ID: {action.id}</div>
                            <div className="text-xs text-gray-500">Time: {action.timestamp}</div>
                            {action.featureArea && (
                              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-block mt-1">
                                {action.featureArea}
                              </div>
                            )}
                            {action.metadata && Object.keys(action.metadata).length > 0 && (
                              <div className="mt-1 text-xs">
                                <div className="font-medium">Metadata:</div>
                                <pre className="bg-slate-100 p-1 rounded mt-1 overflow-x-auto">
                                  {JSON.stringify(action.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="json">
                  <ScrollArea className="h-[400px] w-full rounded border p-4 bg-slate-50">
                    <pre className="text-xs font-mono">
                      {JSON.stringify(actions, null, 2)}
                    </pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
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
          
          <Card>
            <CardHeader>
              <CardTitle>Log History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg bg-white">
                <PromptHistoryViewer variant="inline" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
