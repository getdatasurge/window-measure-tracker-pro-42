
import React from 'react';
import { Bell, HelpCircle, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import WinTrackLogo from '../logo/WinTrackLogo';
import { Input } from '@/components/ui/input';
import ThemeToggle from '../ui/ThemeToggle';
import GlobalSearch from '../ui/GlobalSearch';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/projects') return 'Projects';
    if (path === '/teams') return 'Installation Teams';
    if (path === '/schedule') return 'Schedule';
    if (path === '/reports') return 'Reports';
    if (path === '/measurements') return 'Measurements';
    if (path === '/inventory') return 'Inventory';
    if (path === '/suppliers') return 'Suppliers';
    if (path === '/settings') return 'Settings';
    if (path === '/help') return 'Help & Support';
    
    return 'Dashboard';
  };
  
  return (
    <header className="sticky top-0 z-10 flex justify-between items-center h-16 px-6 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
      <div className="flex items-center gap-10">
        <button 
          onClick={toggleSidebar} 
          className="mr-4 text-gray-600 dark:text-gray-300 lg:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
        
        <WinTrackLogo />
      </div>
      
      <div className="flex items-center gap-4">
        {/* Added global search component here */}
        <GlobalSearch className="hidden md:block" />
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <HelpCircle size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="flex items-center ml-2">
            <Avatar className="h-9 w-9 border border-gray-200 dark:border-zinc-700">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <svg className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
        
        {location.pathname === '/' && (
          <Button className="ml-4 bg-wintrack-dark-blue hover:bg-wintrack-dark-blue-light text-white rounded-md px-4 py-2 h-9 flex items-center text-sm">
            <Plus size={18} className="mr-1.5" />
            New Project
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
