
import { useCallback } from 'react';
import { useProjectList, ProjectOption } from './useProjectList';

interface UseProjectManagementProps {
  setValue: (field: string, value: any) => void;
}

export function useProjectManagement({ setValue }: UseProjectManagementProps) {
  const { projectsList, isLoading, error, fetchProjects } = useProjectList();
  
  const handleProjectChange = useCallback((projectId: string) => {
    const selectedProject = projectsList.find(p => p.id === projectId);
    if (selectedProject) {
      setValue('projectId', selectedProject.id);
      setValue('projectName', selectedProject.name);
    }
  }, [projectsList, setValue]);

  return {
    projectsList,
    fetchProjects,
    handleProjectChange,
    isLoading,
    error
  };
}
