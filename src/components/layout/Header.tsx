
import React from 'react';
import { Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

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
  
  const getActionButton = () => {
    const path = location.pathname;
    
    if (path === '/' || path === '/projects') {
      return (
        <Button className="bg-wintrack-green hover:bg-wintrack-green-dark text-white">
          <Plus size={16} className="mr-1" />
          New Project
        </Button>
      );
    }
    
    if (path === '/teams') {
      return (
        <Button className="bg-wintrack-green hover:bg-wintrack-green-dark text-white">
          <Plus size={16} className="mr-1" />
          Add Team Member
        </Button>
      );
    }
    
    if (path === '/settings') {
      return (
        <Button className="bg-wintrack-green hover:bg-wintrack-green-dark text-white">
          Save Changes
        </Button>
      );
    }
    
    return null;
  };
  
  return (
    <header className="flex justify-between items-center h-16 px-6 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="mr-4 text-gray-600 lg:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">3</span>
        </button>
        {getActionButton()}
      </div>
    </header>
  );
};

export default Header;
