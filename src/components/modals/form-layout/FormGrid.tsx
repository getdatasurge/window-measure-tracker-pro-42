
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
  // Create a responsive grid that stacks on mobile and shows columns on larger screens
  const gridClassMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
  };

  const gridClass = gridClassMap[columns as keyof typeof gridClassMap] || 'grid-cols-1 sm:grid-cols-2';
  
  return (
    <div className={`grid ${gridClass} gap-4 w-full ${className}`}>
      {children}
    </div>
  );
};
