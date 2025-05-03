
import React from 'react';

interface DashboardHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, children }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
};

export default DashboardHeader;
