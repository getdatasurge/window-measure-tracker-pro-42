
import React from 'react';

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

const PageContent: React.FC<PageContentProps> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`w-full max-w-full px-4 sm:px-6 md:px-8 py-4 overflow-x-hidden ${className}`}>
    {children}
  </div>
);

export default PageContent;
