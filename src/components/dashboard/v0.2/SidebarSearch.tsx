import React from 'react';
import { Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
interface SidebarSearchProps {
  collapsed: boolean;
}
const SidebarSearch: React.FC<SidebarSearchProps> = ({
  collapsed
}) => {
  const isMobile = useIsMobile();

  // Hide search on collapsed sidebar or mobile
  if (collapsed) {
    return null;
  }
  return <div className="mt-2 px-4">
      <div className="relative">
        
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          
        </div>
      </div>
    </div>;
};
export default SidebarSearch;