
import React from 'react';
import { FieldSchema } from './types';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FieldRendererProps {
  field: FieldSchema;
  form: UseFormReturn<Record<string, any>, any>;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, form }) => {
  const { register, control, formState: { errors } } = form;
  const error = errors[field.name];
  
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'date':
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <Input
              type={field.type}
              placeholder={field.placeholder}
              className={field.className}
              disabled={field.disabled}
              {...register(field.name, field.validation)}
            />
          </FormControl>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      );
    
    case 'select':
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <Select 
            onValueChange={(value) => {
              // This will be handled by react-hook-form's Controller in a real implementation
            }}
            defaultValue={field.defaultValue}
            disabled={field.disabled}
          >
            <FormControl>
              <SelectTrigger className={field.className}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      );
      
    case 'textarea':
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={field.placeholder}
              className={field.className}
              disabled={field.disabled}
              rows={field.rows || 3}
              {...register(field.name, field.validation)}
            />
          </FormControl>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      );
    
    case 'checkbox':
      return (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              disabled={field.disabled}
              {...register(field.name, field.validation)}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{field.label}</FormLabel>
            {field.description && <FormDescription>{field.description}</FormDescription>}
          </div>
          <FormMessage />
        </FormItem>
      );
    
    case 'radio':
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <RadioGroup
              defaultValue={field.defaultValue}
              className="flex flex-col space-y-1"
              disabled={field.disabled}
            >
              {field.options?.map((option) => (
                <FormItem className="flex items-center space-x-3 space-y-0" key={option.value}>
                  <FormControl>
                    <RadioGroupItem value={option.value} {...register(field.name, field.validation)} />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      );
      
    default:
      return <div>Unsupported field type: {field.type}</div>;
  }
};

export default FieldRenderer;
