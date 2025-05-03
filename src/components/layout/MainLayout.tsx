
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div 
        className={`fixed inset-y-0 left-0 z-20 transform transition-all duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      <div className="flex flex-col w-full">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 overflow-auto lg:ml-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
