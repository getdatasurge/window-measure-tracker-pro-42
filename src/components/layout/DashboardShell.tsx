import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import DashboardSidebar from '../dashboard/v0.2/DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import ThemeToggle from '../ui/ThemeToggle';

interface DashboardShellProps {
  children: ReactNode;
}

const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  // Auto-collapse sidebar when on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const sidebarWidthClass = isMobile
    ? 'ml-0'
    : sidebarCollapsed
    ? 'ml-16'
    : 'ml-64';

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        toggleCollapsed={toggleSidebar}
      />

      <div
        className={`flex-1 transition-all duration-300 ${sidebarWidthClass}`}
      >
        <div className="flex flex-col min-h-screen min-w-screen">
          <header className="h-16 border-b border-zinc-800/70 flex items-center px-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                {isMobile && (
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md hover:bg-zinc-800/50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="4" x2="20" y1="12" y2="12" />
                      <line x1="4" x2="20" y1="6" y2="6" />
                      <line x1="4" x2="20" y1="18" y2="18" />
                    </svg>
                  </button>
                )}
                <h1 className="text-xl font-semibold">WinTrack</h1>
              </div>

              <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-zinc-800/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                </button>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardShell;
