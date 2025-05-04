
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardShell from '../components/layout/DashboardShell';
import ProjectMetricsSection from '../components/projects/ProjectMetricsSection';
import RecentMeasurements from '../components/dashboard/RecentMeasurements';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Overview = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("📊 Overview page mounted");
  }, []);
  
  const handleLogin = () => {
    login();
    navigate('/projects');
  };
  
  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Overview</h1>
            <p className="text-sm text-zinc-400">A snapshot of your project's performance and team activity.</p>
          </div>
          <Button onClick={handleLogin} className="bg-indigo-600 hover:bg-indigo-700">
            {isAuthenticated ? 'Go to Projects' : 'Sign In'}
          </Button>
        </div>
        
        {/* Overview Metrics */}
        <ProjectMetricsSection />
        
        {/* Analytics Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Analytics */}
          <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Performance Analytics</h2>
              <div className="flex flex-col items-center justify-center p-6 bg-zinc-900/30 rounded-lg h-64">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-zinc-400 mb-2">Analytics visualization coming soon</p>
                    <div className="h-2 w-36 bg-zinc-800 rounded-full overflow-hidden mx-auto">
                      <div className="h-full bg-indigo-600 w-3/4 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Team Activity */}
          <ActivityFeed />
        </div>
        
        {/* Recent Measurements */}
        <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Measurements</h2>
            <RecentMeasurements />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default Overview;
