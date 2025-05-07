
import React, { useEffect } from 'react';
import { validateColumn } from '@/utils/db/schemaValidator';

interface InputSourceFieldProps {
  register: any;
  value?: string;
}

const InputSourceField: React.FC<InputSourceFieldProps> = ({ register, value = 'manual' }) => {
  const [columnExists, setColumnExists] = React.useState<boolean>(false);
  
  // Check if the column exists in the database
  useEffect(() => {
    const checkColumn = async () => {
      try {
        const exists = await validateColumn('measurements', 'input_source');
        setColumnExists(exists);
        console.log('input_source column exists:', exists);
      } catch (error) {
        console.error('Error checking input_source column:', error);
        setColumnExists(false);
      }
    };
    
    checkColumn();
  }, []);
  
  // Only render the field if the column exists
  if (!columnExists) {
    console.log('Skipping input_source field as column does not exist in database');
    return null;
  }
  
  return (
    <input 
      type="hidden" 
      {...register('input_source')} 
      defaultValue={value} 
    />
  );
};

export default InputSourceField;
