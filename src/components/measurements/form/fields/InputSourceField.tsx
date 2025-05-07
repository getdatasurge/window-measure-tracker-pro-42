
import React from 'react';

interface InputSourceFieldProps {
  register: any;
  value?: string;
}

const InputSourceField: React.FC<InputSourceFieldProps> = ({ register, value = 'manual' }) => {
  return (
    <input 
      type="hidden" 
      {...register('input_source')} 
      value={value} 
    />
  );
};

export default InputSourceField;
