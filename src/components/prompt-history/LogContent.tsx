
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import LogEntry from './LogEntry';
import { PromptLogEntry, DailyLogs } from './types';

interface LogContentProps {
  isLoading: boolean;
  error: string | null;
  logEntries: PromptLogEntry[];
  dailyLogs: DailyLogs;
  maxHeight?: string;
}

const LogContent: React.FC<LogContentProps> = ({
  isLoading,
  error,
  logEntries,
  dailyLogs,
  maxHeight = '60vh'
}) => {
  const [activeTab, setActiveTab] = useState('all');
  
  return (
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
          <ScrollArea style={{ height: maxHeight }}>
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
          <ScrollArea style={{ height: maxHeight }}>
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
};

export default LogContent;
