
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarToggle } from '@/components/ui/SidebarToggle';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollDirection = useScrollDirection();
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Auto collapse sidebar on mobile when scrolling down
  useEffect(() => {
    if (isMobile) {
      if (scrollDirection === 'down') {
        setSidebarOpen(false);
      } else if (scrollDirection === 'up') {
        setSidebarOpen(true);
      }
      
      // Debug logs
      console.log("Scroll direction:", scrollDirection);
      console.log("Sidebar open:", sidebarOpen);
    }
  }, [scrollDirection, isMobile]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="relative z-20">
        <div 
          className={`
            fixed inset-y-0 left-0 z-20 
            transition-all duration-300 ease-in-out
            ${isMobile 
              ? `transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
              : `${sidebarOpen ? 'w-52' : 'w-16'}`
            }
            h-screen
          `}
        >
          <Sidebar />
          <SidebarToggle isOpen={sidebarOpen} toggle={toggleSidebar} />
        </div>
        
        {/* Backdrop for mobile */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>

      <div className={`flex flex-col w-full transition-all duration-300 ${isMobile ? '' : sidebarOpen ? 'lg:ml-52' : 'lg:ml-16'}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
