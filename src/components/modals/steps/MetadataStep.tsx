
import React, { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { X, File, Tag } from 'lucide-react';

interface MetadataStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

const MetadataStep: React.FC<MetadataStepProps> = ({ form }) => {
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues('tags') || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue('tags', [...currentTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue(
      'tags',
      currentTags.filter(tag => tag !== tagToRemove)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">
          <File className="h-5 w-5 inline-block mr-2" />
          Metadata & Attachments
        </h2>
        <p className="text-sm text-zinc-400 mb-4">Add additional information and files to your project.</p>
      </div>

      <Form {...form}>
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-md font-medium text-white">Project Metadata</h3>
            
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
            
            <FormItem>
              <FormLabel className="text-white">
                <Tag className="h-4 w-4 inline-block mr-2" />
                Tags
              </FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {(form.getValues('tags') || []).map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-zinc-700 text-white border-zinc-600 py-1">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-zinc-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="bg-zinc-800 border-zinc-700 text-white flex-1"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600"
                >
                  Add
                </button>
              </div>
              <FormDescription>
                Add relevant tags to help categorize and find this project later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-md font-medium text-white">Attachments</h3>
            
            <div className="space-y-4">
              <FormItem>
                <FormLabel className="text-white">Blueprints</FormLabel>
                <FormControl>
                  <Input 
                    type="file"
                    multiple
                    className="bg-zinc-800 border-zinc-700 text-white"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      form.setValue('attachments.blueprints', files);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Upload blueprints or floor plans (PDF, PNG, JPG).
                </FormDescription>
                <FormMessage />
              </FormItem>
              
              <FormItem>
                <FormLabel className="text-white">Photos</FormLabel>
                <FormControl>
                  <Input 
                    type="file"
                    multiple
                    accept="image/*"
                    className="bg-zinc-800 border-zinc-700 text-white"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      form.setValue('attachments.photos', files);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Upload site photos or reference images.
                </FormDescription>
                <FormMessage />
              </FormItem>
              
              <FormItem>
                <FormLabel className="text-white">Contracts & Documents</FormLabel>
                <FormControl>
                  <Input 
                    type="file"
                    multiple
                    className="bg-zinc-800 border-zinc-700 text-white"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      form.setValue('attachments.contracts', files);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Upload contracts, agreements, or other relevant documents.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default MetadataStep;
