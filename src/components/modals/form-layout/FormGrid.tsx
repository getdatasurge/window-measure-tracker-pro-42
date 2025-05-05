
import React from 'react';

interface FormGridProps {
  children: React.ReactNode;
  columns?: number;
  className?: string;
}

export const FormGrid: React.FC<FormGridProps> = ({ 
  children, 
  columns = 2, 
  className = "" 
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4 ${className}`}>
      {children}
    </div>
  );
};
