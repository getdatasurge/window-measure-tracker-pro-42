
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { File } from 'lucide-react';
import { ProjectFormValues } from '../project-form/validation-schema';
import MetadataSection from './metadata/MetadataSection';
import TagsInputField from './metadata/TagsInputField';
import AttachmentsSection from './metadata/AttachmentsSection';
import { FormSection } from '../form-layout';

interface MetadataStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

const MetadataStep: React.FC<MetadataStepProps> = ({ form }) => {
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
        <div className="space-y-6">
          {/* Metadata Section */}
          <FormSection>
            <MetadataSection form={form} />
          </FormSection>
          
          {/* Tags Input Field */}
          <FormSection>
            <TagsInputField form={form} />
          </FormSection>
          
          {/* Attachments Section */}
          <FormSection>
            <AttachmentsSection form={form} />
          </FormSection>
        </div>
      </Form>
    </div>
  );
};

export default MetadataStep;
