
import { ReactNode } from 'react';
import { RegisterOptions } from 'react-hook-form';

// Base field interface
export interface BaseFieldSchema {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  className?: string;
  validation?: RegisterOptions;
  disabled?: boolean;
  hidden?: boolean;
}

// Regular input field types
export interface InputFieldSchema extends BaseFieldSchema {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
}

// Select field type
export interface SelectFieldSchema extends BaseFieldSchema {
  type: 'select';
  options: Array<{ label: string; value: string }>;
}

// Textarea field type
export interface TextareaFieldSchema extends BaseFieldSchema {
  type: 'textarea';
  rows?: number;
}

// Checkbox field type
export interface CheckboxFieldSchema extends BaseFieldSchema {
  type: 'checkbox';
  label: string;
}

// Radio group field type
export interface RadioGroupFieldSchema extends BaseFieldSchema {
  type: 'radio';
  options: Array<{ label: string; value: string }>;
}

// Dynamic field type that changes based on another field's value
export interface DynamicFieldSchema extends BaseFieldSchema {
  type: 'dynamic';
  dynamicType: {
    dependsOn: string;
    map: Record<string, string>; // Maps dependsOn values to field types
  };
}

// Repeatable field group
export interface RepeatableFieldSchema extends BaseFieldSchema {
  type: 'repeatable';
  fields: FormFieldSchema[];
  minItems?: number;
  maxItems?: number;
  addButtonText?: string;
  removeButtonText?: string;
}

// Union type of all possible field schemas
export type FormFieldSchema = 
  | InputFieldSchema 
  | SelectFieldSchema 
  | TextareaFieldSchema
  | CheckboxFieldSchema
  | RadioGroupFieldSchema
  | DynamicFieldSchema
  | RepeatableFieldSchema;

// Form schema consisting of multiple fields
export interface FormSchema {
  fields: FormFieldSchema[];
}
