
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { RepeatableFieldSchema } from './types';
import { FieldRenderer } from './FieldRenderer';
import { FormGrid } from '@/components/modals/form-layout/FormGrid';
import { FormSection } from '@/components/modals/form-layout/FormSection';
import { Plus, Minus } from 'lucide-react';

interface RepeatableFieldGroupProps {
  field: RepeatableFieldSchema;
  fieldPath?: string;
}

export const RepeatableFieldGroup: React.FC<RepeatableFieldGroupProps> = ({ field, fieldPath = '' }) => {
  const { control } = useFormContext();
  const fullPath = fieldPath ? `${fieldPath}.${field.name}` : field.name;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: fullPath
  });

  const handleAdd = () => {
    // Create an empty object with the structure matching the field schema
    const emptyItem = field.fields.reduce((acc, fieldSchema) => {
      acc[fieldSchema.name] = '';
      return acc;
    }, {} as Record<string, any>);
    
    append(emptyItem);
  };

  return (
    <FormSection 
      title={field.label}
      description={field.description}
      className="border border-zinc-800 rounded-md p-4 overflow-hidden w-full"
    >
      <div className="space-y-4 w-full">
        {fields.map((item, index) => (
          <FormSection key={item.id} className="mb-4 pb-4 border-b border-zinc-800 last:border-0 w-full">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-white">{`${field.label} ${index + 1}`}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="h-8 text-red-400 hover:text-red-300"
              >
                <Minus className="h-4 w-4 mr-1" />
                {field.removeButtonText || "Remove"}
              </Button>
            </div>
            
            <FormGrid columns={field.fields.length > 1 ? 2 : 1}>
              {field.fields.map((nestedField) => (
                <FieldRenderer
                  key={`${fullPath}.${index}.${nestedField.name}`}
                  field={nestedField}
                  fieldPath={`${fullPath}.${index}`}
                />
              ))}
            </FormGrid>
          </FormSection>
        ))}
      </div>
      
      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        className="mt-2 border-dashed border-zinc-700 hover:border-zinc-500 w-full sm:w-auto"
        disabled={field.maxItems !== undefined && fields.length >= field.maxItems}
      >
        <Plus className="h-4 w-4 mr-1" />
        {field.addButtonText || `Add ${field.label}`}
      </Button>
      
      {field.minItems !== undefined && fields.length < field.minItems && (
        <p className="text-xs text-amber-500 mt-1">
          At least {field.minItems} {field.minItems === 1 ? 'item' : 'items'} required
        </p>
      )}
    </FormSection>
  );
};
