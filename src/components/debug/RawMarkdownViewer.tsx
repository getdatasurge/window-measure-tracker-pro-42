
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RawMarkdownViewerProps {
  markdownSource: string;
  isLoading: boolean;
}

const RawMarkdownViewer: React.FC<RawMarkdownViewerProps> = ({ markdownSource, isLoading }) => {
  return (
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
  );
};

export default RawMarkdownViewer;
