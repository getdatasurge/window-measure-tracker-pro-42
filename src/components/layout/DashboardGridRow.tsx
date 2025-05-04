
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardGridRowProps {
  children: ReactNode;
  className?: string;
}

/**
 * DashboardGridRow - A reusable layout component that arranges children
 * in a column on mobile and side-by-side on desktop (lg breakpoint and up)
 */
const DashboardGridRow: React.FC<DashboardGridRowProps> = ({ 
  children,
  className
}) => {
  return (
    <div 
      className={cn(
        "flex flex-col lg:flex-row gap-6",
        className
      )}
    >
      {children}
    </div>
  );
};

export default DashboardGridRow;
