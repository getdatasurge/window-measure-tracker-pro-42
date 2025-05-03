
import React from 'react';
import { useLocation } from 'react-router-dom';
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
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import WinTrackLogo from '../../logo/WinTrackLogo';
import SidebarMenuSection from './SidebarMenuSection';
import SidebarSearch from './SidebarSearch';
import SidebarUserProfile from './SidebarUserProfile';

interface SidebarProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ collapsed, toggleCollapsed }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const mainMenuItems = [
    { name: 'Dashboard', path: '/dashboard/v0.2', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Teams', path: '/teams', icon: Users },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  const toolsMenuItems = [
    { name: 'Measurements', path: '/measurements', icon: Ruler },
    { name: 'Inventory', path: '/inventory', icon: PackageOpen },
    { name: 'Suppliers', path: '/suppliers', icon: Truck },
  ];

  const settingsMenuItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Help & Support', path: '/help', icon: HelpCircle },
  ];

  return (
    <motion.div
      initial={{ width: collapsed ? 64 : 240 }}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2 }}
      className="bg-[#0f0f0f] h-screen flex flex-col fixed left-0 top-0 border-r border-zinc-800/70 z-20"
    >
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <WinTrackLogo />}
        {collapsed && <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center text-white font-bold">W</div>}
        <button 
          onClick={toggleCollapsed}
          className="p-1.5 rounded-md bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      <SidebarSearch collapsed={collapsed} />
      
      <div className="flex-1 overflow-auto pt-4 scrollbar-none">
        <div>
          <div className={`px-4 py-1.5 text-xs uppercase tracking-wider text-zinc-500 ${collapsed ? 'text-center' : ''}`}>
            {!collapsed ? 'Main Menu' : '•••'}
          </div>
          {mainMenuItems.map((item) => (
            <SidebarMenuItem
              key={item.path}
              name={item.name}
              path={item.path}
              icon={item.icon}
              isActive={isActive(item.path)}
              collapsed={collapsed}
              layoutId="active-nav-pill"
            />
          ))}
        </div>
        
        <SidebarMenuSection 
          title="Tools" 
          items={toolsMenuItems} 
          collapsed={collapsed} 
          isActive={isActive} 
          layoutId="active-nav-tool"
        />
        
        <SidebarMenuSection 
          title="Settings" 
          items={settingsMenuItems} 
          collapsed={collapsed} 
          isActive={isActive} 
          layoutId="active-nav-settings"
        />
      </div>
      
      <SidebarUserProfile 
        collapsed={collapsed}
        avatarUrl="/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png"
        name="Alex Morgan"
        role="Project Manager"
      />
    </motion.div>
  );
};

export default DashboardSidebar;
