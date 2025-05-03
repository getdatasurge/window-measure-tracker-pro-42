
import React from 'react';
import { Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarSearchProps {
  collapsed: boolean;
}

const SidebarSearch: React.FC<SidebarSearchProps> = ({ collapsed }) => {
  const isMobile = useIsMobile();
  
  // Hide search on collapsed sidebar or mobile
  if (collapsed) {
    return null;
  }
  
  return (
    <div className="mt-2 px-4">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full h-9 bg-zinc-800/50 border-none text-zinc-300 text-sm rounded-md pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-zinc-700"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search size={14} className="text-zinc-500" />
        </div>
      </div>
    </div>
  );
};

export default SidebarSearch;
