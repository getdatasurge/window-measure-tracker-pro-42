
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ProjectTable from '../projects/ProjectTable';
import { useToast } from '@/hooks/use-toast';
import { fetchProjects } from '@/services/projectService';

interface DashboardProjectsSectionProps {
  className?: string;
}

interface Project {
  id: string;
  name: string;
  client_name?: string;
  location?: string;
  status?: string;
  entries_count?: number;
  deadline?: string;
}

const DashboardProjectsSection: React.FC<DashboardProjectsSectionProps> = ({ className }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const getProjects = async () => {
      try {
        setLoading(true);
        console.log('Fetching active projects...');
        
        // Fetch projects using our service
        const projectData = await fetchProjects(true);
        
        console.log('Projects data received:', projectData);
        
        if (!projectData || projectData.length === 0) {
          console.log('No active projects found');
          setProjects([]);
          setLoading(false);
          return;
        }
        
        // For each project, fetch the count of related entries with proper error handling
        const projectsWithEntryCounts = await Promise.all(projectData.map(async (project) => {
          if (!project || !project.id) {
            // Handle potentially malformed project data
            return { ...project, entries_count: 0 };
          }
          
          try {
            const { count, error: countError } = await supabase
              .from('entries')
              .select('*', { count: 'exact', head: true })
              .eq('project_id', project.id);
              
            if (countError) {
              console.error('Error fetching entry count for project:', project.id, countError);
              return { ...project, entries_count: 0 };
            }
            
            return { ...project, entries_count: count || 0 };
          } catch (countErr) {
            console.error('Exception fetching entry count for project:', project.id, countErr);
            return { ...project, entries_count: 0 };
          }
        }));
        
        setProjects(projectsWithEntryCounts || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error loading projects",
          description: "Failed to load active projects. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    getProjects();
  }, [toast]);
  
  // Transform the projects data with safe handling of optional properties
  const formattedProjects = projects.map(project => ({
    id: project.id || 'unknown-id',
    name: project.name || 'Untitled Project',
    client: project.client_name || 'No Client',
    location: project.location || 'No Location',
    status: project.status || 'active',
    entries_count: project.entries_count || 0,
    deadline: project.deadline || 'Not set'
  }));

  return (
    <Card className={`bg-zinc-800/50 border border-zinc-700/50 shadow-lg ${className}`}>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Active Projects</h2>
        <ProjectTable projects={formattedProjects} loading={loading} />
      </CardContent>
    </Card>
  );
};

export default DashboardProjectsSection;
