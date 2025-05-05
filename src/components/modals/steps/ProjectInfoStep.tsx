
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ProjectInfoStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

const PROJECT_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'institutional', label: 'Institutional' },
];

const ProjectInfoStep: React.FC<ProjectInfoStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Project Information</h2>
        <p className="text-sm text-zinc-400 mb-4">Enter the basic details of your project.</p>
      </div>

      <Form {...form}>
        <div className="space-y-4">
          {/* Two-column layout for name and type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Name Field - Left Column */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Project Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter project name" 
                      className="bg-zinc-800 border-zinc-700 text-white"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Give your project a clear, descriptive name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Type Field - Right Column */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Project Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      {PROJECT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the category that best describes your project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Full-width Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide a detailed description of the project"
                    className="bg-zinc-800 border-zinc-700 text-white min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Describe the project scope, goals, and any special considerations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
};

export default ProjectInfoStep;
