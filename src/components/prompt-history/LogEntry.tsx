
import React from 'react';
import { format } from 'date-fns';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { PromptLogEntry } from './types';

interface LogEntryProps {
  entry: PromptLogEntry;
}

const LogEntry: React.FC<LogEntryProps> = ({ entry }) => {
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

export default LogEntry;
