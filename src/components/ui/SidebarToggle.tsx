
import React from 'react';
import { Button } from './button';
import { PanelLeft } from 'lucide-react';

interface SidebarToggleProps {
  onClick?: () => void;
  collapsed?: boolean;
  isOpen?: boolean;
  toggle?: () => void;
}

export function SidebarToggle({ onClick, collapsed = false, isOpen, toggle }: SidebarToggleProps) {
  // Use either onClick or toggle, preferring toggle if provided
  const handleClick = toggle || onClick;
  // Use either collapsed or isOpen (inverted), preferring isOpen if provided
  const isCollapsed = isOpen !== undefined ? !isOpen : collapsed;
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleClick}
      className="h-9 w-9"
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <PanelLeft className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
    </Button>
  );
}

// Export the component as default for backward compatibility
export default SidebarToggle;
