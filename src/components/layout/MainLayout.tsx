import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarToggle } from '@/components/ui/SidebarToggle';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to check scroll direction and auto-collapse sidebar on mobile
  const handleScroll = useCallback(() => {
    if (isMobile) {
      // Only collapse sidebar when scrolling down on mobile
      if (window.scrollY > 10) {
        setSidebarOpen(false);
      }
    }
  }, [isMobile]);

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Auto collapse sidebar on mobile when component mounts
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden w-full">
      {/* Sidebar container with fixed positioning */}
      <div className={`relative z-20 shrink-0 ${isMobile ? 'w-0' : ''}`}>
        <div 
          className={`
            fixed inset-y-0 left-0 z-20 
            transition-all duration-300 ease-in-out
            ${isMobile 
              ? `transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
              : `${sidebarOpen ? 'w-64' : 'w-16'}`
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

      {/* Main content that fills remaining space */}
      <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out">
        {/* Apply left margin on desktop only */}
        <div 
          className={`
            flex-1 flex flex-col w-full
            transition-all duration-300 ease-in-out
            ${isMobile 
              ? '' 
              : sidebarOpen 
                ? 'ml-64' 
                : 'ml-16'
            }
          `}
        >
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-4 overflow-x-hidden">
            <div className="w-full max-w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
