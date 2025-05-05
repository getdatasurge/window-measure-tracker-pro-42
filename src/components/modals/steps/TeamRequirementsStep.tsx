
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
import { ProjectFormValues } from '../project-form/validation-schema';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Users } from 'lucide-react';
import { FormGrid, FormSection } from '../form-layout';

interface TeamRequirementsStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

// Mock data for project managers
const PROJECT_MANAGERS = [
  { id: 'pm1', name: 'Alex Johnson' },
  { id: 'pm2', name: 'Taylor Smith' },
  { id: 'pm3', name: 'Jordan Williams' },
  { id: 'pm4', name: 'Morgan Davis' },
];

// Mock data for installers
const INSTALLERS = [
  { id: 'inst1', name: 'Chris Rodriguez' },
  { id: 'inst2', name: 'Sam Garcia' },
  { id: 'inst3', name: 'Robin Martinez' },
  { id: 'inst4', name: 'Casey Lopez' },
  { id: 'inst5', name: 'Blake Thompson' },
  { id: 'inst6', name: 'Jamie Wilson' },
];

const TeamRequirementsStep: React.FC<TeamRequirementsStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">
          <Users className="h-5 w-5 inline-block mr-2" />
          Team & Requirements
        </h2>
        <p className="text-sm text-zinc-400 mb-4">Assign team members and define project requirements.</p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          <FormSection title="Team Assignment">
            <FormGrid>
              <FormField
                control={form.control}
                name="team.projectManager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Project Manager</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="Select a project manager" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        {PROJECT_MANAGERS.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The person responsible for overseeing this project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="estimatedWindows"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Estimated Windows</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="Enter number of windows" 
                        className="bg-zinc-800 border-zinc-700 text-white"
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Approximate number of windows for this project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormGrid>
            
            <FormField
              control={form.control}
              name="team.installers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Installers</FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2">
                    {INSTALLERS.map((installer) => (
                      <div key={installer.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`installer-${installer.id}`}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                          checked={field.value?.includes(installer.id) || false}
                          onChange={(e) => {
                            const currentValues = new Set(field.value || []);
                            if (e.target.checked) {
                              currentValues.add(installer.id);
                            } else {
                              currentValues.delete(installer.id);
                            }
                            field.onChange(Array.from(currentValues));
                          }}
                        />
                        <label htmlFor={`installer-${installer.id}`} className="text-sm text-white">
                          {installer.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormDescription>
                    Select all team members who will be working on this project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>
          
          <FormSection title="Project Requirements">
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Special Instructions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter any special instructions or requirements for the team"
                      className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Include any additional instructions, access details, or special considerations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>
        </div>
      </Form>
    </div>
  );
};

export default TeamRequirementsStep;
