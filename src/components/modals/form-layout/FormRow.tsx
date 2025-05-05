
import React from 'react';

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

export const FormRow: React.FC<FormRowProps> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`flex flex-col gap-2 ${className}`}>{children}</div>
);
