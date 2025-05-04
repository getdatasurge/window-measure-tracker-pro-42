
import React from 'react';

interface SidebarSearchProps {
  collapsed: boolean;
}

// This component is now a placeholder as the search functionality has been moved to the header
const SidebarSearch: React.FC<SidebarSearchProps> = ({ collapsed }) => {
  // Return empty div to maintain component structure
  return <div className={`${collapsed ? 'px-2' : 'px-4'} my-2`}></div>;
};

export default SidebarSearch;
