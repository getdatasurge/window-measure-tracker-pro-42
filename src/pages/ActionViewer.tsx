
import React, { useState, useEffect } from 'react';
import ActionPanel from '@/components/ActionPanel';
import ActionSearchPanel from '@/components/ActionSearchPanel';
import MarkdownUploader from '@/components/markdown-uploader';
import MarkdownEditor from '@/components/MarkdownEditor';
import { WindowAction, readMarkdownFile, parseWindowActions } from '@/lib/parseWindowActions';
import { MarkdownSyncProvider } from '@/contexts/MarkdownSyncContext';
import { assignFeatureArea } from '@/utils/assignFeatureArea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ActionViewer: React.FC = () => {
  const [uploadedActions, setUploadedActions] = useState<WindowAction[]>([]);
  const [useUploaded, setUseUploaded] = useState(false);
  const [initialMarkdown, setInitialMarkdown] = useState<string>('');
  const [enrichedActions, setEnrichedActions] = useState<WindowAction[]>([]);
  
  const handleUpload = (actions: WindowAction[]) => {
    // Enrich actions with feature areas
    const enriched = actions.map(action => ({
      ...action,
      featureArea: assignFeatureArea(action)
    }));
    
    setUploadedActions(enriched);
    setUseUploaded(true);
    setEnrichedActions(enriched);
  };
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  useEffect(() => {
    if (isDevelopment) {
      const loadInitialMarkdown = async () => {
        try {
          const content = await readMarkdownFile('window-tracker-prd.md');
          setInitialMarkdown(content);
          
          // Parse and enrich actions for the search panel
          const actions = parseWindowActions(content);
          const enriched = actions.map(action => ({
            ...action,
            featureArea: assignFeatureArea(action)
          }));
          setEnrichedActions(enriched);
        } catch (error) {
          console.error('Error loading initial markdown:', error);
        }
      };
      
      loadInitialMarkdown();
    }
  }, [isDevelopment]);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Window Actions Viewer</h1>
      
      {isDevelopment && (
        <MarkdownSyncProvider initialContent={initialMarkdown}>
          <Tabs defaultValue="view" className="mb-6">
            <TabsList className="mb-2">
              <TabsTrigger value="view">View Actions</TabsTrigger>
              <TabsTrigger value="search">Search Actions</TabsTrigger>
              <TabsTrigger value="upload">Upload Markdown</TabsTrigger>
              <TabsTrigger value="edit">Edit Markdown</TabsTrigger>
            </TabsList>
            
            <TabsContent value="view">
              {useUploaded && uploadedActions.length > 0 ? (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-lg font-medium">Uploaded Actions</h2>
                    <button 
                      onClick={() => setUseUploaded(false)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Switch to default source
                    </button>
                  </div>
                  <ActionPanel 
                    actions={uploadedActions} 
                    maxHeight="60vh" 
                  />
                </div>
              ) : (
                <ActionPanel 
                  filePath={isDevelopment ? "window-tracker-prd.md" : undefined}
                  jsonPath="/data/window-actions.json"
                  maxHeight="70vh"
                />
              )}
            </TabsContent>
            
            <TabsContent value="search">
              <ActionSearchPanel 
                actions={enrichedActions}
                maxHeight="70vh"
              />
            </TabsContent>
            
            <TabsContent value="upload">
              <MarkdownUploader onUpload={handleUpload} />
            </TabsContent>
            
            <TabsContent value="edit">
              <MarkdownEditor 
                initialContent={initialMarkdown}
                onContentChange={content => {
                  setInitialMarkdown(content);
                  
                  // Update enriched actions when content changes
                  const actions = parseWindowActions(content);
                  const enriched = actions.map(action => ({
                    ...action,
                    featureArea: assignFeatureArea(action)
                  }));
                  setEnrichedActions(enriched);
                }}
              />
            </TabsContent>
          </Tabs>
        </MarkdownSyncProvider>
      )}
      
      {!isDevelopment && (
        <ActionPanel 
          jsonPath="/data/window-actions.json"
          maxHeight="70vh"
        />
      )}
    </div>
  );
};

export default ActionViewer;
