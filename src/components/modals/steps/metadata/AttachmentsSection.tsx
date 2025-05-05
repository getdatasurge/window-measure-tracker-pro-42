
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProjectFormValues } from '../../project-form/validation-schema';
import { FormGrid } from '../../form-layout';

interface AttachmentsSectionProps {
  form: UseFormReturn<ProjectFormValues>;
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-white">Attachments</h3>
      
      <FormGrid columns={3}>
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
      </FormGrid>
    </div>
  );
};

export default AttachmentsSection;
