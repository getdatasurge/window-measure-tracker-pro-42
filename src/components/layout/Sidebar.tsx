
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { LogOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, signOut } = useAuth();
  const isMobile = useIsMobile();

  // Define navigation items
  const navigationItems: NavItem[] = [
    { name: 'Overview', href: '/overview', icon: 'home' },
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Projects', href: '/projects', icon: 'projects' },
    { name: 'Teams', href: '/teams', icon: 'team' },
    { name: 'Schedule', href: '/schedule', icon: 'schedule' },
    { name: 'Reports', href: '/reports', icon: 'reports' },
    { name: 'Settings', href: '/settings', icon: 'settings' },
  ];

  // Map of icon names to SVG paths
  const iconPaths: { [key: string]: string } = {
    home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10',
    dashboard: 'M3 13h8V3H3v10zm9 0h8V3h-8v10zm-9 8h8v-6H3v6zm9 0h8v-6h-8v6z',
    projects: 'M12 2L2 7l10 5 10-5-10-5zm0 13L2 18l10 5 10-5-10-5z',
    team: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 118 0 4 4 0 01-8 0M22 21v-2a4 4 0 010 7.75',
    schedule: 'M8 2v20M16 2v20M3 6h18M3 18h18',
    reports: 'M16 17v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h7a2 2 0 012 2v2m3-7V3a2 2 0 012-2h2a2 2 0 012 2v11a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2m-3-4h18',
    settings: 'M12 2v2m-4 0v2M4 2v2m16 0v2M21 12h-2m-4 0h-2M4 12h2m4 0h2M16 20v2m-4 0v2M4 20v2m16 0v2',
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="flex flex-col h-full bg-white border-r shadow-sm">
      <div className="flex-1 px-3 py-2">
        <Link to="/" className="flex items-center pl-6 pb-3 ml-3 text-sm font-bold">
          WinTrack
        </Link>
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors",
                location.pathname === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
              )}
            >
              <svg
                className="mr-2 h-4 w-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={iconPaths[item.icon]}
                />
              </svg>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      {isAuthenticated && !isMobile && (
        <div className="p-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">Logged in</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-md text-red-500 hover:bg-gray-100 hover:text-red-600 transition-colors"
                  aria-label="Log out"
                >
                  <LogOut size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Log out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
