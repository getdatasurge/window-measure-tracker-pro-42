
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Measurement } from '@/types/measurement';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface StatusWorkflowTabProps {
  formData: Measurement;
  updateFormData: (field: string, value: any) => void;
}

export default function StatusWorkflowTab({ formData, updateFormData }: StatusWorkflowTabProps) {
  const [date, setDate] = useState<Date | undefined>(
    formData.installationDate ? new Date(formData.installationDate) : undefined
  );
  
  const handleStatusChange = (status: string) => {
    updateFormData('status', status);
    
    // Reset installation date if status is not 'installed'
    if (status !== 'Installed') {
      updateFormData('installationDate', undefined);
      setDate(undefined);
    }
  };
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      updateFormData('installationDate', selectedDate.toISOString());
    } else {
      updateFormData('installationDate', undefined);
    }
  };
  
  // Status options
  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Film_Cut', label: 'Film Cut' },
    { value: 'Installed', label: 'Installed' },
    { value: 'Completed', label: 'Completed' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Status Selector */}
      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm text-zinc-400">Status</Label>
        <Select 
          value={formData.status} 
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value} className="text-white">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Installation Date (only shown for Installed status) */}
      {formData.status === 'Installed' && (
        <div className="space-y-2">
          <Label htmlFor="installationDate" className="text-sm text-zinc-400">
            Installation Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal bg-zinc-800/50 border-zinc-700 text-white ${!date && "text-zinc-400"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select installation date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-zinc-800 border-zinc-700">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
                className="bg-zinc-800 text-white"
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-zinc-500">
            Required for "Installed" status
          </p>
        </div>
      )}
      
      {/* Review Comments */}
      <div className="space-y-2">
        <Label htmlFor="reviewComments" className="text-sm text-zinc-400">
          Review Comments
        </Label>
        <Textarea
          id="reviewComments"
          value={formData.reviewComments || ''}
          onChange={(e) => updateFormData('reviewComments', e.target.value)}
          placeholder="Add any review comments here..."
          className="bg-zinc-800/50 border-zinc-700 text-white resize-none h-24"
        />
      </div>
    </div>
  );
}
