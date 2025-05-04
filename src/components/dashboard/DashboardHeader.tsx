
import React from 'react';

interface DashboardHeaderProps {
  title: string;
  actionButton?: React.ReactNode;
  children?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  actionButton,
  children
}) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
      {actionButton && (
        <div className="flex items-center space-x-2">
          {actionButton}
        </div>
      )}
      {children}
    </div>
  );
};

export default DashboardHeader;
