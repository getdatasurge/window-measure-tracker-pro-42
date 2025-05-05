
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '../../project-form/validation-schema';

interface LocationFieldsProps {
  form: UseFormReturn<ProjectFormValues>;
}

const LocationFields: React.FC<LocationFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-white">Location Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
      
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
  );
};

export default LocationFields;
