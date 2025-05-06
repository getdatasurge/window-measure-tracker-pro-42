
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ProjectHeader from '../components/projects/ProjectHeader';
import ProjectMetricsSection from '../components/projects/ProjectMetricsSection';
import ProjectFilters from '../components/projects/ProjectFilters';
import ProjectTable from '../components/projects/ProjectTable';
import ProjectWidgetsSection from '../components/projects/ProjectWidgetsSection';
import withResponsiveLayout from '@/hoc/withResponsiveLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Interface matching the ProjectTable's expected format
interface TableProjectFormat {
  id: string;
  name: string;
  client: string;
  location?: string;
  deadline: string;
  status: string;
  entries_count?: number;
}

const ProjectsNewPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState<TableProjectFormat[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, client_name, location, deadline, status');
          
        if (error) {
          throw error;
        }
        
        // Transform data to match the expected format
        const formattedProjects: TableProjectFormat[] = data.map(project => ({
          id: project.id,
          name: project.name || 'Untitled Project',
          client: project.client_name || 'No Client',
          location: project.location || '',
          deadline: project.deadline || 'Not set',
          status: project.status || 'active'
        }));
        
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Failed to load projects",
          description: "There was an error loading the project data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [toast]);
  
  const [filteredProjects, setFilteredProjects] = useState<TableProjectFormat[]>([]);
  
  // Update filtered projects whenever projects or filter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects);
      return;
    }
    
    const filtered = projects.filter(project => 
      project.status.toLowerCase() === activeFilter.toLowerCase()
    );
    setFilteredProjects(filtered);
  }, [projects, activeFilter]);
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <ProjectHeader />
      
      {/* Overview Metrics */}
      <ProjectMetricsSection />
      
      {/* Filters Toolbar */}
      <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
        <CardContent className="p-6">
          <ProjectFilters onFilterChange={handleFilterChange} activeFilter={activeFilter} />
        </CardContent>
      </Card>
      
      {/* Active Projects Table */}
      <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Active Projects</h2>
          <ProjectTable projects={filteredProjects} loading={loading} />
        </CardContent>
      </Card>
      
      {/* Bottom Widget Grid */}
      <ProjectWidgetsSection />
    </div>
  );
};

export default withResponsiveLayout(ProjectsNewPage);
