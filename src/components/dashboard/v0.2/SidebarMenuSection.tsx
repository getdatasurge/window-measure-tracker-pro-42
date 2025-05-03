
import React from 'react';
import { LucideIcon } from 'lucide-react';
import SidebarMenuItem from './SidebarMenuItem';

interface MenuItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarMenuSectionProps {
  title: string;
  items: MenuItem[];
  collapsed: boolean;
  isActive: (path: string) => boolean;
  layoutId: string;
}

const SidebarMenuSection: React.FC<SidebarMenuSectionProps> = ({ 
  title, 
  items, 
  collapsed, 
  isActive,
  layoutId
}) => {
  return (
    <div className="mt-6">
      <div className={`px-4 py-1.5 text-xs uppercase tracking-wider text-zinc-500 ${collapsed ? 'text-center' : ''}`}>
        {!collapsed ? title : '•••'}
      </div>
      {items.map((item) => (
        <SidebarMenuItem
          key={item.path}
          name={item.name}
          path={item.path}
          icon={item.icon}
          isActive={isActive(item.path)}
          collapsed={collapsed}
          layoutId={`${layoutId}-${item.name.toLowerCase()}`}
        />
      ))}
    </div>
  );
};

export default SidebarMenuSection;
