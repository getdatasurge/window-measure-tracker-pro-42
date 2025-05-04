
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarToggleProps {
  isOpen: boolean;
  toggle: () => void;
  className?: string;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  isOpen,
  toggle,
  className
}) => {
  return (
    <button
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls="sidebar"
      aria-label="Toggle Sidebar"
      className={cn(
        "absolute top-1/2 -translate-y-1/2 right-[-12px] z-30",
        "bg-muted rounded-full shadow hover:ring-2 ring-accent",
        "size-6 flex items-center justify-center",
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      {isOpen ? (
        <ChevronLeft size={14} />
      ) : (
        <ChevronRight size={14} />
      )}
    </button>
  );
};
