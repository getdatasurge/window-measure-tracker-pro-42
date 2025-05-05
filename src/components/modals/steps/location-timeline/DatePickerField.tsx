
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface DatePickerFieldProps {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  disabledDatePredicate?: (date: Date) => boolean;
  form: any; // Using any here for simplicity, in a real app you'd want to type this properly
  required?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ 
  name, 
  label, 
  description, 
  placeholder = 'Pick a date',
  disabledDatePredicate,
  form,
  required = false
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-white">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={`w-full bg-zinc-800 border-zinc-700 text-white pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  // Ensure immediate update with proper validation
                  if (date) {
                    field.onChange(date.toISOString());
                    form.trigger(name);
                  }
                }}
                disabled={disabledDatePredicate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePickerField;
