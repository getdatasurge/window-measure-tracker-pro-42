
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormSchema } from './types';
import { FieldRenderer } from './FieldRenderer';
import { RepeatableFieldGroup } from './RepeatableFieldGroup';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

interface SchemaFormProps {
  schema: FormSchema;
  defaultValues?: Record<string, any>;
  zodSchema?: z.ZodType<any>;
  onSubmit: (data: any) => void;
  submitText?: string;
  isSubmitting?: boolean;
}

export const SchemaForm: React.FC<SchemaFormProps> = ({
  schema,
  defaultValues = {},
  zodSchema,
  onSubmit,
  submitText = 'Submit',
  isSubmitting = false
}) => {
  const formMethods = useForm({
    defaultValues,
    resolver: zodSchema ? zodResolver(zodSchema) : undefined,
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...formMethods}>
      <Form {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-6 w-full">
          <div className="space-y-4 w-full min-w-0 overflow-hidden">
            {schema.fields.map((field) => {
              if (field.type === 'repeatable') {
                return <RepeatableFieldGroup key={field.name} field={field} />;
              }
              return <FieldRenderer key={field.name} field={field} />;
            })}
          </div>

          <div className="flex justify-end pt-4 w-full">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : submitText}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};
