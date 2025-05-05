
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage,
  Form
} from '@/components/ui/form';
import { ProjectFormValues } from '../CreateProjectModal';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon, MapPin } from 'lucide-react';

interface LocationTimelineStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

const LocationTimelineStep: React.FC<LocationTimelineStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">
          <MapPin className="h-5 w-5 inline-block mr-2" />
          Location & Timeline
        </h2>
        <p className="text-sm text-zinc-400 mb-4">Enter the project location and timeline details.</p>
      </div>

      <Form {...form}>
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-md font-medium text-white">Location Information</h3>
            
            <FormField
              control={form.control}
              name="location.addressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Address Line 1</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Street address" 
                      className="bg-zinc-800 border-zinc-700 text-white"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location.addressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Address Line 2</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Apt, Suite, Building (optional)" 
                      className="bg-zinc-800 border-zinc-700 text-white"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="location.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">City</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="City" 
                        className="bg-zinc-800 border-zinc-700 text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">State</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="State" 
                        className="bg-zinc-800 border-zinc-700 text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location.zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">ZIP Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ZIP" 
                        className="bg-zinc-800 border-zinc-700 text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <h3 className="text-md font-medium text-white">Timeline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeline.startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white">Start Date <span className="text-red-500">*</span></FormLabel>
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
                              <span>Pick a date</span>
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
                              form.trigger("timeline.startDate");
                            }
                          }}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When will the project begin?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeline.endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white">End Date</FormLabel>
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
                              <span>Pick a date</span>
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
                              form.trigger("timeline.endDate");
                            }
                          }}
                          disabled={(date) => 
                            date < new Date("1900-01-01") || 
                            (form.getValues().timeline.startDate && date < new Date(form.getValues().timeline.startDate))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When is the project expected to end?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default LocationTimelineStep;
