import React, { useState, useEffect } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { EntryList } from './EntryList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MeasurementEntriesManagerProps {
  defaultProjectId?: string;
}

export const MeasurementEntriesManager: React.FC<MeasurementEntriesManagerProps> = ({
  defaultProjectId
}) => {
  const { getProjects } = useProjects();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(defaultProjectId || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await getProjects();

        if (!isMounted) return;

        setProjects(projectsData || []);

        // Auto-select first project only if nothing is selected yet
        if (!defaultProjectId && projectsData?.length > 0 && !selectedProjectId) {
          setSelectedProjectId(projectsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [getProjects, defaultProjectId, selectedProjectId]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Window Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-4">
              <p>No projects found. Please create a project first.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Project
                </label>
                <Select
                  value={selectedProjectId}
                  onValueChange={setSelectedProjectId}
                >
                  <SelectTrigger className="w-full sm:w-[300px]">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProjectId && (
                <EntryList
                  projectId={selectedProjectId}
                  projectName={selectedProject?.name}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
