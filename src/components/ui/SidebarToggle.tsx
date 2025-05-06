
import React from 'react';
import { Button } from './button';
import { PanelLeft } from 'lucide-react';

interface SidebarToggleProps {
  onClick?: () => void;
  collapsed?: boolean;
}

export function SidebarToggle({ onClick, collapsed = false }: SidebarToggleProps) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={onClick}
      className="h-9 w-9"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <PanelLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
    </Button>
  );
}
