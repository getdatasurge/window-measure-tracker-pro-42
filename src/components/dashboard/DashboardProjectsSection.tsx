
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetProjectsQuery } from '@/services/apiSlice';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardProjectsSection = () => {
  const { 
    data: projectsResponse, 
    error, 
    isLoading,
    refetch
  } = useGetProjectsQuery();
  
  const projects = projectsResponse?.data || [];
  
  if (isLoading) {
    return (
      <Card className="border border-zinc-800 bg-zinc-900/50 h-full">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || projectsResponse?.error) {
    return (
      <Card className="border border-red-800/50 bg-red-900/10 h-full">
        <CardContent className="p-6">
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <h3 className="text-lg font-medium text-red-400">Error loading projects</h3>
            <p className="text-zinc-400 text-sm text-center">
              {error || projectsResponse?.error || 'An unknown error occurred'}
            </p>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="border border-zinc-800 bg-zinc-900/50 h-full">
        <CardContent className="p-6">
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <h3 className="text-lg font-medium text-zinc-400">No Projects Found</h3>
            <p className="text-zinc-500 text-sm text-center">
              Start by creating your first project
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-zinc-800 bg-zinc-900/50 h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Active Projects</h3>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
        
        <div className="space-y-4">
          {projects.slice(0, 5).map((project) => (
            <div key={project.id} className="border-b border-zinc-800/50 pb-3 last:border-0">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-white">{project.name || 'Unnamed Project'}</span>
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">
                  {project.status || 'Active'}
                </span>
              </div>
              <div className="text-zinc-400 text-sm">{project.client_name || 'No Client'}</div>
              <div className="flex justify-between mt-1">
                <span className="text-zinc-500 text-xs">{project.location || 'No Location'}</span>
                <span className="text-zinc-500 text-xs">
                  {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardProjectsSection;
