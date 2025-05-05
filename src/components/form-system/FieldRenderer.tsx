
import React from 'react';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { FormFieldSchema } from './types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { FormRow } from '@/components/modals/form-layout/FormRow';

interface FieldRendererProps {
  field: FormFieldSchema;
  fieldPath?: string;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, fieldPath = '' }) => {
  const { control, register, watch } = useFormContext();
  
  // Full field path (important for nested fields in repeatable groups)
  const fullPath = fieldPath ? `${fieldPath}.${field.name}` : field.name;
  
  // Handle dynamic field types
  if (field.type === 'dynamic') {
    const dependsOnPath = fieldPath 
      ? `${fieldPath}.${field.dynamicType.dependsOn}` 
      : field.dynamicType.dependsOn;
    
    const triggerValue = watch(dependsOnPath);
    const actualType = field.dynamicType.map[triggerValue] || 'text';
    
    // Create a "proxy" field with the resolved type
    const proxyField: FormFieldSchema = {
      ...field,
      type: actualType as any
    };
    
    // Recursively render the field with the resolved type
    return <FieldRenderer field={proxyField} fieldPath={fieldPath} />;
  }
  
  // Render the appropriate field based on type
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'tel':
    case 'url':
    case 'date':
      return (
        <Controller
          name={fullPath}
          control={control}
          rules={field.validation}
          render={({ field: controllerField, fieldState }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Input 
                  type={field.type}
                  placeholder={field.placeholder}
                  className={field.className}
                  disabled={field.disabled}
                  {...controllerField}
                />
              </FormControl>
              {field.description && <FormDescription>{field.description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    
    case 'select':
      return (
        <Controller
          name={fullPath}
          control={control}
          rules={field.validation}
          render={({ field: controllerField, fieldState }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <Select 
                onValueChange={controllerField.onChange}
                defaultValue={controllerField.value}
                disabled={field.disabled}
              >
                <FormControl>
                  <SelectTrigger className={field.className}>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.description && <FormDescription>{field.description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
      
    case 'textarea':
      return (
        <Controller
          name={fullPath}
          control={control}
          rules={field.validation}
          render={({ field: controllerField, fieldState }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={field.placeholder}
                  className={field.className}
                  disabled={field.disabled}
                  rows={field.rows || 3}
                  {...controllerField}
                />
              </FormControl>
              {field.description && <FormDescription>{field.description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    
    case 'checkbox':
      return (
        <Controller
          name={fullPath}
          control={control}
          rules={field.validation}
          render={({ field: controllerField, fieldState }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={controllerField.value}
                  onCheckedChange={controllerField.onChange}
                  disabled={field.disabled}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{field.label}</FormLabel>
                {field.description && <FormDescription>{field.description}</FormDescription>}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    
    case 'radio':
      return (
        <Controller
          name={fullPath}
          control={control}
          rules={field.validation}
          render={({ field: controllerField, fieldState }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={controllerField.onChange}
                  defaultValue={controllerField.value}
                  className="flex flex-col space-y-1"
                  disabled={field.disabled}
                >
                  {field.options.map((option) => (
                    <FormItem className="flex items-center space-x-3 space-y-0" key={option.value}>
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel className="font-normal">{option.label}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              {field.description && <FormDescription>{field.description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
      
    default:
      return <div>Unsupported field type: {(field as any).type}</div>;
  }
};
