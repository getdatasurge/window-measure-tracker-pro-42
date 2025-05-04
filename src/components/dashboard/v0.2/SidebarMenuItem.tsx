
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarMenuItemProps {
  name: string;
  path: string;
  icon: LucideIcon;
  isActive: boolean;
  collapsed: boolean;
  layoutId: string;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ 
  name, 
  path, 
  icon: Icon, 
  isActive, 
  collapsed,
  layoutId
}) => {
  // Update paths to use the new pages
  const getActualPath = () => {
    if (path === '/projects') return '/projects-new';
    if (path === '/settings') return '/user/current/settings'; // Update settings path
    return path;
  };
  
  const actualPath = getActualPath();
  
  return (
    <Link 
      to={actualPath} 
      className={`flex items-center px-4 py-2.5 my-1 mx-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-green-900/20 text-green-400' 
          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <div className={`${isActive ? 'text-green-400' : 'text-zinc-400'}`}>
        <Icon size={18} />
      </div>
      {!collapsed && (
        <span className="ml-3 text-sm">{name}</span>
      )}
      {isActive && !collapsed && (
        <motion.div
          layoutId={layoutId}
          className="absolute left-0 w-1 h-5 bg-green-400 rounded-full"
        />
      )}
    </Link>
  );
};

export default SidebarMenuItem;
