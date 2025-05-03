
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Calendar, 
  FileText,
  Ruler,
  PackageOpen,
  Truck,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import WinTrackLogo from '../../logo/WinTrackLogo';

interface SidebarProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ collapsed, toggleCollapsed }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const mainMenuItems = [
    { name: 'Dashboard', path: '/dashboard/v0.2', icon: <LayoutDashboard size={18} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={18} /> },
    { name: 'Teams', path: '/teams', icon: <Users size={18} /> },
    { name: 'Schedule', path: '/schedule', icon: <Calendar size={18} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={18} /> },
  ];

  const toolsMenuItems = [
    { name: 'Measurements', path: '/measurements', icon: <Ruler size={18} /> },
    { name: 'Inventory', path: '/inventory', icon: <PackageOpen size={18} /> },
    { name: 'Suppliers', path: '/suppliers', icon: <Truck size={18} /> },
  ];

  const settingsMenuItems = [
    { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
    { name: 'Help & Support', path: '/help', icon: <HelpCircle size={18} /> },
  ];

  return (
    <motion.div
      initial={{ width: collapsed ? 64 : 240 }}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2 }}
      className="bg-[#0f0f0f] h-screen flex flex-col fixed left-0 top-0 border-r border-zinc-800/70 z-20"
    >
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <WinTrackLogo className="h-8" />}
        {collapsed && <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center text-white font-bold">W</div>}
        <button 
          onClick={toggleCollapsed}
          className="p-1.5 rounded-md bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      {!collapsed && (
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
      )}
      
      <div className="flex-1 overflow-auto pt-4 scrollbar-none">
        <div>
          <div className={`px-4 py-1.5 text-xs uppercase tracking-wider text-zinc-500 ${collapsed ? 'text-center' : ''}`}>
            {!collapsed ? 'Main Menu' : '•••'}
          </div>
          {mainMenuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center px-4 py-2.5 my-1 mx-2 rounded-md transition-colors ${
                isActive(item.path) 
                  ? 'bg-green-900/20 text-green-400' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <div className={`${isActive(item.path) ? 'text-green-400' : 'text-zinc-400'}`}>
                {item.icon}
              </div>
              {!collapsed && (
                <span className="ml-3 text-sm">{item.name}</span>
              )}
              {isActive(item.path) && !collapsed && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute left-0 w-1 h-5 bg-green-400 rounded-full"
                />
              )}
            </Link>
          ))}
        </div>
        
        <div className="mt-6">
          <div className={`px-4 py-1.5 text-xs uppercase tracking-wider text-zinc-500 ${collapsed ? 'text-center' : ''}`}>
            {!collapsed ? 'Tools' : '•••'}
          </div>
          {toolsMenuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center px-4 py-2.5 my-1 mx-2 rounded-md transition-colors ${
                isActive(item.path) 
                  ? 'bg-green-900/20 text-green-400' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <div className={`${isActive(item.path) ? 'text-green-400' : 'text-zinc-400'}`}>
                {item.icon}
              </div>
              {!collapsed && (
                <span className="ml-3 text-sm">{item.name}</span>
              )}
              {isActive(item.path) && !collapsed && (
                <motion.div
                  layoutId="active-nav-tool"
                  className="absolute left-0 w-1 h-5 bg-green-400 rounded-full"
                />
              )}
            </Link>
          ))}
        </div>
        
        <div className="mt-6">
          <div className={`px-4 py-1.5 text-xs uppercase tracking-wider text-zinc-500 ${collapsed ? 'text-center' : ''}`}>
            {!collapsed ? 'Settings' : '•••'}
          </div>
          {settingsMenuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center px-4 py-2.5 my-1 mx-2 rounded-md transition-colors ${
                isActive(item.path) 
                  ? 'bg-green-900/20 text-green-400' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <div className={`${isActive(item.path) ? 'text-green-400' : 'text-zinc-400'}`}>
                {item.icon}
              </div>
              {!collapsed && (
                <span className="ml-3 text-sm">{item.name}</span>
              )}
              {isActive(item.path) && !collapsed && (
                <motion.div
                  layoutId="active-nav-settings"
                  className="absolute left-0 w-1 h-5 bg-green-400 rounded-full"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
      
      {!collapsed && (
        <div className="p-4 border-t border-zinc-800/70 flex items-center">
          <div className="w-9 h-9 rounded-full bg-zinc-700 flex-shrink-0 overflow-hidden">
            <img 
              src="/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png" 
              alt="Alex Morgan" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-white">Alex Morgan</div>
            <div className="text-xs text-zinc-400">Project Manager</div>
          </div>
        </div>
      )}
      
      {collapsed && (
        <div className="p-4 border-t border-zinc-800/70 flex justify-center">
          <div className="w-9 h-9 rounded-full bg-zinc-700 flex-shrink-0 overflow-hidden">
            <img 
              src="/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png" 
              alt="Alex Morgan" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardSidebar;
