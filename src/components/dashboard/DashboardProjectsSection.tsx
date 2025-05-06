
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ProjectTable from '../projects/ProjectTable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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
}

const DashboardProjectsSection: React.FC<DashboardProjectsSectionProps> = ({ className }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Fetch active projects
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('id, name, client_name, location, status')
          .eq('is_active', true);
          
        if (projectError) {
          throw projectError;
        }
        
        // For each project, fetch the count of related entries with proper error handling
        const projectsWithEntryCounts = await Promise.all((projectData || []).map(async (project) => {
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
    
    fetchProjects();
  }, [toast]);
  
  // Transform the projects data with safe handling of optional properties
  const formattedProjects = projects.map(project => ({
    id: project.id || 'unknown-id',
    name: project.name || 'Untitled Project',
    client: project.client_name || 'No Client',
    location: project.location || 'No Location',
    status: project.status || 'active',
    entries_count: project.entries_count || 0
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
