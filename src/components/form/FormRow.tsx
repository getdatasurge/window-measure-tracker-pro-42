
import React from 'react';

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

const FormRow: React.FC<FormRowProps> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`flex flex-col gap-2 w-full min-w-0 ${className}`}>{children}</div>
);

export default FormRow;
