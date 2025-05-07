
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useGetProjectsQuery } from '@/services/apiSlice';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardProjectsSection: React.FC = () => {
  const { data: projectsResponse, error, isLoading } = useGetProjectsQuery();
  
  return (
    <Card className="col-span-1 h-full">
      <CardHeader className="pb-3">
        <CardTitle>Active Projects</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full" />
          </>
        ) : error ? (
          <div className="text-sm text-red-500">
            Error loading projects: {String(error)}
          </div>
        ) : projectsResponse?.data?.length ? (
          <ul className="space-y-2">
            {projectsResponse.data.slice(0, 5).map((project) => (
              <li key={project.id} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <div className="font-medium">{project.name}</div>
                {project.client_name && (
                  <div className="text-xs text-zinc-500">{project.client_name}</div>
                )}
                {project.status && (
                  <div className="mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700">
                      {project.status}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-zinc-500">No active projects found</div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardProjectsSection;
