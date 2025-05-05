
export interface StepSchema {
  title: string;
  description?: string;
  fields: FieldSchema[];
  columns?: number;
}

export interface FieldSchema {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date';
  placeholder?: string;
  description?: string;
  validation?: any;
  options?: { label: string; value: string }[];
  defaultValue?: any;
  disabled?: boolean;
  className?: string;
  rows?: number;
}

// Re-export existing form-system types
export * from '@/components/form-system/types';
