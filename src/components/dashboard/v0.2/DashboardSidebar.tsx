
import React from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, Calendar, FileText, Ruler, Settings, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import WinTrackLogo from '../../logo/WinTrackLogo';
import SidebarMenuSection from './SidebarMenuSection';
import SidebarUserProfile from './SidebarUserProfile';
import SidebarMenuItem from './SidebarMenuItem';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';

interface SidebarProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({
  collapsed,
  toggleCollapsed
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();

  // Auto-collapse sidebar on mobile
  React.useEffect(() => {
    if (isMobile && !collapsed) {
      toggleCollapsed();
    }
  }, [isMobile, collapsed, toggleCollapsed]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const mainMenuItems = [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard
  }, {
    name: 'Projects',
    path: '/projects',
    icon: FolderKanban
  }, {
    name: 'Teams',
    path: '/teams',
    icon: Users
  }, {
    name: 'Schedule',
    path: '/schedule',
    icon: Calendar
  }, {
    name: 'Reports',
    path: '/reports',
    icon: FileText
  }, {
    name: 'Measurements',
    path: '/measurements',
    icon: Ruler
  }];

  return (
    <motion.div 
      initial={{
        width: collapsed ? 64 : 240
      }} 
      animate={{
        width: collapsed ? 64 : 240
      }} 
      transition={{
        duration: 0.2
      }} 
      className="bg-[#0f0f0f] h-screen flex flex-col fixed left-0 top-0 border-r border-zinc-800/70 z-20"
    >
      <div className="p-0 flex shrink-0 h-[10%] items-center">
        {!collapsed ? <WinTrackLogo /> : (
          <div className="w-8 h-8 bg-[#92f877] rounded-md flex items-center justify-center text-black font-bold text-lg">
            WT
          </div>
        )}
        <button 
          onClick={toggleCollapsed} 
          className="p-5 h-[1.5rem] bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors px-0 py-0 pl-[1rem] w-[1.5rem] rounded"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="stroke-[4] -pl-[1.5rem]">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Removed SidebarSearch component */}
      
      <div className="flex-1 overflow-auto pt-4 scrollbar-none">
        <div>
          <div className={`px-4 py-1.5 text-xs uppercase tracking-wider text-zinc-500 ${collapsed ? 'text-center' : ''}`}>
            {!collapsed ? 'Main Menu' : '•••'}
          </div>
          {mainMenuItems.map(item => (
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
      </div>
      
      <SidebarUserProfile 
        collapsed={collapsed} 
        avatarUrl="/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png" 
        name="Alex Morgan" 
        role="Project Manager" 
      />

      {/* Settings and Theme Toggle Footer */}
      <div className={`px-2 py-3 border-t border-zinc-800/70 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center`}>
        <SidebarMenuItem 
          name="Settings"
          path="/settings"
          icon={Settings}
          isActive={isActive('/settings')}
          collapsed={collapsed}
          layoutId="settings-nav"
        />
        
        <button 
          onClick={toggleTheme}
          className={`flex items-center justify-center p-2 rounded-md text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 ${collapsed ? 'mx-auto mt-2' : ''}`}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </motion.div>
  );
};

export default DashboardSidebar;
