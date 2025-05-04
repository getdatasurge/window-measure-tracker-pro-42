
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const ApplicationSettingsCard = () => {
  const form = useForm({
    defaultValues: {
      theme: 'dark',
      density: 'comfortable',
      measurementUnits: 'imperial',
      dateFormat: 'mm-dd-yyyy'
    }
  });
  
  const onSubmit = (data: any) => {
    console.log('App settings submitted:', data);
    // Handle saving settings
  };
  
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Application Settings</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2">Appearance</h3>
              
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-zinc-400">Theme</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-white">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        <SelectItem value="dark">Dark (Default)</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="density"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel className="text-sm text-zinc-400">Density</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-white">
                          <SelectValue placeholder="Select density" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormField
                control={form.control}
                name="measurementUnits"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm text-zinc-400">Measurement Units</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="imperial" id="imperial" className="text-green-400" />
                          <Label htmlFor="imperial">Imperial (inches)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="metric" id="metric" />
                          <Label htmlFor="metric">Metric (centimeters)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="both" id="both" />
                          <Label htmlFor="both">Show both</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormField
                control={form.control}
                name="dateFormat"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm text-zinc-400">Date Format</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mm-dd-yyyy" id="mm-dd-yyyy" className="text-green-400" />
                          <Label htmlFor="mm-dd-yyyy">MM/DD/YYYY</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dd-mm-yyyy" id="dd-mm-yyyy" />
                          <Label htmlFor="dd-mm-yyyy">DD/MM/YYYY</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yyyy-mm-dd" id="yyyy-mm-dd" />
                          <Label htmlFor="yyyy-mm-dd">YYYY-MM-DD</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Save Settings
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ApplicationSettingsCard;
