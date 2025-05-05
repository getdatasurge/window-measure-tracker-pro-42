
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ProjectFormValues } from '../../project-form/validation-schema';
import { FormGrid } from '../../form-layout';

interface MetadataSectionProps {
  form: UseFormReturn<ProjectFormValues>;
}

const MetadataSection: React.FC<MetadataSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-white">Project Metadata</h3>
      
      <FormGrid>
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Priority Level</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Set the priority level for this project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="budgetEstimate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Budget Estimate ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Enter budget estimate" 
                  className="bg-zinc-800 border-zinc-700 text-white"
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                Approximate budget for this project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormGrid>
    </div>
  );
};

export default MetadataSection;
