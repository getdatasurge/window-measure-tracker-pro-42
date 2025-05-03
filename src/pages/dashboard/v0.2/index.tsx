
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import RecentProjectsTable from '@/components/dashboard/RecentProjectsTable';
import RecentMeasurements from '@/components/dashboard/RecentMeasurements';
import TeamActivityFeed from '@/components/dashboard/TeamActivityFeed';

const DashboardV2: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-6">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard <span className="bg-green-800 text-green-200 text-xs px-2 py-1 rounded ml-2">Beta</span></h1>
            <h2 className="text-xl mt-6">Overview</h2>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-zinc-800 border-zinc-700 text-zinc-200 rounded-lg py-2 pl-10 pr-4 w-[240px] focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
              <Plus size={16} />
              New Project
            </Button>
          </div>
        </div>
        
        {/* Metrics */}
        <div className="mb-8">
          <DashboardMetrics />
        </div>
        
        {/* Recent Projects */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Projects</h2>
            <a href="#" className="text-green-500 hover:text-green-400 text-sm font-medium">View All</a>
          </div>
          <RecentProjectsTable />
        </div>
        
        {/* Two-column layout for measurements and activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Measurements</h2>
              <a href="#" className="text-green-500 hover:text-green-400 text-sm font-medium">View All</a>
            </div>
            <RecentMeasurements />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Team Activity</h2>
            <TeamActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardV2;
