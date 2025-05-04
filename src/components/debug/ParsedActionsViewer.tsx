
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WindowAction } from '@/lib/parseWindowActions';

interface ParsedActionsViewerProps {
  actions: WindowAction[];
  loading: boolean;
  error: string | null;
}

const ParsedActionsViewer: React.FC<ParsedActionsViewerProps> = ({ actions, loading, error }) => {
  return (
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
  );
};

export default ParsedActionsViewer;
