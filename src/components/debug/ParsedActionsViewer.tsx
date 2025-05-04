
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from 'lucide-react';
import { WindowAction } from './types';

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
          <List className="h-5 w-5" />
          <span>Parsed Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground mb-2">
              {actions.length} actions found
            </div>
            <div className="border rounded-lg p-2 bg-slate-50 max-h-[300px] overflow-y-auto">
              <pre className="text-xs font-mono">
                {JSON.stringify(actions, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParsedActionsViewer;
