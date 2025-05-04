
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, RefreshCw } from 'lucide-react';
import { parseWindowActions, readMarkdownFile } from '@/lib/parseWindowActions';
import { useLiveFileSync } from '@/hooks/useLiveFileSync';
import { usePromptLogger } from '@/hooks/usePromptLogger';

// Imported components
import RawMarkdownViewer from '@/components/debug/RawMarkdownViewer';
import ParsedActionsViewer from '@/components/debug/ParsedActionsViewer';
import ContextInjectionTest from '@/components/debug/ContextInjectionTest';
import LogHistoryCard from '@/components/debug/LogHistoryCard';

const DebugPage: React.FC = () => {
  // Check if we're in dev mode
  const isDev = process.env.NODE_ENV === 'development';
  
  const [markdownSource, setMarkdownSource] = useState<string>('');
  const [parsedActions, setParsedActions] = useState<WindowAction[]>([]);
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
          <RawMarkdownViewer 
            markdownSource={markdownSource} 
            isLoading={isLoading} 
          />
          
          <ParsedActionsViewer 
            actions={actions}
            loading={loading}
            error={error}
          />
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          <ContextInjectionTest 
            actions={actions}
            logPromptResponse={logPromptResponse}
          />
          
          <LogHistoryCard />
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
