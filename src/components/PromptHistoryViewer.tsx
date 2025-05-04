
import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface PromptLogEntry {
  id: string;
  timestamp: string;
  prompt: string;
  response: string;
  contextSummary?: string;
}

interface DailyLogs {
  [date: string]: PromptLogEntry[];
}

interface PromptHistoryViewerProps {
  variant?: 'dialog' | 'sheet' | 'inline';
  maxHeight?: string;
}

const PromptHistoryViewer: React.FC<PromptHistoryViewerProps> = ({
  variant = 'dialog',
  maxHeight = '70vh'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logEntries, setLogEntries] = useState<PromptLogEntry[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLogs>({});
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock function to fetch logs - in a real app, this would call your API
  // This is a placeholder since we don't have a real endpoint yet
  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In development, we'd fetch from the actual API
      // For now, we'll use mock data
      // In production, this would call a secure API endpoint
      
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
  
  const renderLogContent = () => (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileText size={16} />
            <span>All Prompts</span>
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Calendar size={16} />
            <span>By Date</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <ScrollArea className="h-[60vh]">
            {isLoading ? (
              <div className="py-8 text-center text-gray-500">Loading prompt history...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">{error}</div>
            ) : logEntries.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No prompt history found.</div>
            ) : (
              <div className="space-y-4">
                {logEntries.map((entry) => (
                  <LogEntry key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="daily" className="mt-4">
          <ScrollArea className="h-[60vh]">
            {isLoading ? (
              <div className="py-8 text-center text-gray-500">Loading daily logs...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">{error}</div>
            ) : Object.keys(dailyLogs).length === 0 ? (
              <div className="py-8 text-center text-gray-500">No daily logs found.</div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(dailyLogs)
                  .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                  .map(([date, entries]) => (
                    <AccordionItem key={date} value={date}>
                      <AccordionTrigger className="text-sm font-medium">
                        {format(new Date(date), 'MMMM d, yyyy')} ({entries.length} entries)
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pl-4 pt-2">
                          {entries.map((entry) => (
                            <LogEntry key={entry.id} entry={entry} />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  // Render based on variant
  if (variant === 'dialog') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FileText size={16} />
            <span>Prompt History</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Prompt History</DialogTitle>
          </DialogHeader>
          {renderLogContent()}
        </DialogContent>
      </Dialog>
    );
  } else if (variant === 'sheet') {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FileText size={16} />
            <span>Prompt History</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Prompt History</SheetTitle>
          </SheetHeader>
          {renderLogContent()}
        </SheetContent>
      </Sheet>
    );
  } else {
    // Inline variant
    return (
      <div className="border rounded-lg bg-white shadow-sm">
        <div className="border-b p-4">
          <h2 className="text-lg font-medium">Prompt History</h2>
        </div>
        {renderLogContent()}
      </div>
    );
  }
};

// Individual log entry component
const LogEntry: React.FC<{ entry: PromptLogEntry }> = ({ entry }) => {
  const { timestamp, prompt, response, contextSummary } = entry;
  const formattedTime = format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  
  return (
    <div className="border-l-4 border-gray-300 pl-4 py-2">
      <p className="text-xs text-gray-500 italic mb-2">{formattedTime}</p>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="prompt">
          <AccordionTrigger className="text-sm font-medium">🧠 Prompt</AccordionTrigger>
          <AccordionContent>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
              {prompt}
            </pre>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="response">
          <AccordionTrigger className="text-sm font-medium">🪄 Response</AccordionTrigger>
          <AccordionContent>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
              {response}
            </pre>
          </AccordionContent>
        </AccordionItem>
        
        {contextSummary && (
          <AccordionItem value="context">
            <AccordionTrigger className="text-sm font-medium">📚 Context</AccordionTrigger>
            <AccordionContent>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                {contextSummary}
              </pre>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default PromptHistoryViewer;
