
import React from 'react';
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
  HelpCircle
} from 'lucide-react';
import WinTrackLogo from '../logo/WinTrackLogo';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const mainMenuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
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
    <div className="w-52 bg-wintrack-dark-blue h-screen flex flex-col fixed left-0 top-0">
      <div className="p-4">
        <Link to="/">
          <WinTrackLogo />
        </Link>
      </div>
      
      <div className="mt-2 px-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full h-8 bg-wintrack-dark-blue-light border-none text-gray-300 text-sm rounded-md pl-8 pr-2 focus:outline-none focus:ring-1 focus:ring-wintrack-green"
          />
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto pt-4">
        <div>
          <div className="sidebar-section">MAIN MENU</div>
          {mainMenuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
        
        <div>
          <div className="sidebar-section">TOOLS</div>
          {toolsMenuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
        
        <div>
          <div className="sidebar-section">SETTINGS</div>
          {settingsMenuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-wintrack-dark-blue-light flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0">
          <img 
            src="/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png" 
            alt="Alex Morgan" 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-white">Alex Morgan</div>
          <div className="text-xs text-gray-400">Project Manager</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
