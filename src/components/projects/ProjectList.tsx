
import { useEffect, useState } from 'react';
import { useProjects, ProjectData } from '@/hooks/useProjects';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NewProjectModal } from '@/components/modals/NewProjectModal';
import { UserAssignmentModal } from '@/components/modals/UserAssignmentModal';
import { DeleteProjectModal } from '@/components/modals/DeleteProjectModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { PlusCircle, Users, Loader2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ProjectList() {
  const { getProjects, deleteProject, loading: projectsLoading } = useProjects();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleProjectCreated = () => {
    loadProjects();
  };

  const openAssignmentModal = (project: ProjectData) => {
    setSelectedProject(project);
    setIsAssignmentModalOpen(true);
  };

  const openDeleteModal = (project: ProjectData) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!selectedProject || !selectedProject.id) return;
    
    try {
      setIsDeleting(true);
      await deleteProject(selectedProject.id);
      await loadProjects();
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return <Badge>N/A</Badge>;
    
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'on hold':
        return <Badge className="bg-yellow-500">On Hold</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Projects</h2>
        <Button 
          onClick={() => setIsNewProjectModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" /> Add New Project
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No projects found.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsNewProjectModalOpen(true)}
              >
                Create your first project
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.client_name || 'N/A'}</TableCell>
                      <TableCell>
                        {project.deadline 
                          ? format(new Date(project.deadline), 'MMM d, yyyy') 
                          : 'Not set'}
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAssignmentModal(project)}
                          >
                            <Users className="h-4 w-4 mr-1" /> Assign
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(project)}
                            className="text-red-500 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <NewProjectModal 
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {selectedProject && (
        <>
          <UserAssignmentModal
            isOpen={isAssignmentModalOpen}
            onClose={() => setIsAssignmentModalOpen(false)}
            project={selectedProject}
            onAssigned={() => loadProjects()}
          />
          
          <DeleteProjectModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            project={selectedProject}
            onDelete={handleDeleteProject}
            isDeleting={isDeleting}
          />
        </>
      )}
    </div>
  );
}
