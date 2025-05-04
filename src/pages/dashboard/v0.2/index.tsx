import React, { useState, useEffect } from 'react';
import { Plus, Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import RecentProjectsTable from '@/components/dashboard/RecentProjectsTable';
import RecentMeasurements from '@/components/dashboard/RecentMeasurements';
import TeamActivityFeed from '@/components/dashboard/TeamActivityFeed';
import DashboardSidebar from '@/components/dashboard/v0.2/DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
const DashboardV2: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  // Set sidebar collapsed by default on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };
  const fadeIn = {
    hidden: {
      opacity: 0,
      y: 10
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  return <div className="min-h-screen bg-[#0f0f0f] text-white">
      <DashboardSidebar collapsed={sidebarCollapsed} toggleCollapsed={toggleSidebar} />
      
      <div className="transition-all duration-200" style={{
      marginLeft: sidebarCollapsed ? '64px' : '240px',
      width: `calc(100% - ${sidebarCollapsed ? '64px' : '240px'})`
    }}>
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="sticky top-0 z-10 backdrop-blur-md bg-[#0f0f0f]/80 border-b border-zinc-800/70 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {isMobile && <Button variant="ghost" size="icon" className="md:hidden text-zinc-400 hover:text-white" onClick={toggleSidebar}>
                  <Menu size={20} />
                </Button>}
              <h1 className="text-2xl font-semibold">Dashboard <span className="bg-green-900/30 text-green-400 text-xs px-2 py-0.5 rounded ml-2 border border-green-700/30">Beta</span></h1>
            </div>
            <div className="flex gap-4 items-center">
              <div className="relative hidden md:block">
                <input type="text" placeholder="Search..." className="bg-zinc-800/70 border-zinc-700/50 text-zinc-200 rounded-lg py-2 pl-10 pr-4 w-[240px] focus:outline-none focus:ring-1 focus:ring-zinc-700" />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-zinc-500" />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white rounded-full">
                  <Bell size={18} />
                </Button>
                
                
              </div>
              
              <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
                <Plus size={16} />
                <span className="hidden sm:inline">New Project</span>
              </Button>
            </div>
          </div>
          
          <h2 className="text-xl mt-6">Overview</h2>
        </motion.div>
        
        <div className="p-6 space-y-8">
          {/* Metrics */}
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.5,
          delay: 0.1
        }}>
            <DashboardMetrics />
          </motion.div>
          
          {/* Recent Projects */}
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Projects</h2>
              <Button variant="link" className="text-green-400 hover:text-green-300 p-0">View All</Button>
            </div>
            <RecentProjectsTable />
          </motion.div>
          
          {/* Two-column layout for measurements and activity */}
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.5,
          delay: 0.3
        }} className="grid grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Measurements</h2>
                <Button variant="link" className="text-green-400 hover:text-green-300 p-0">View All</Button>
              </div>
              <RecentMeasurements />
            </div>
            <div className="space-y-4 grid xs:grid-cols-4 3xl:grid-cols-6">
              <div className="flex">
              <h2 className="text-xl font-semibold lg:col-span-2 space-y-4 pb-[.65rem]">Team Activity</h2>
              <TeamActivityFeed />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>;
};
export default DashboardV2;