
import { ProjectOption, ProjectDetails } from '@/types/project-types';

export interface ProjectsHookState {
  projects: ProjectOption[];
  loading: boolean;
  error: Error | null;
}

export interface ProjectDetailState {
  project: ProjectDetails | null;
  loading: boolean;
  error: Error | null;
}

export interface UseFetchProjectsReturn {
  (activeOnly?: boolean): Promise<ProjectOption[]>;
}

export interface UseFetchProjectByIdReturn {
  (id: string): Promise<ProjectDetails | null>;
}

export interface UseCreateProjectReturn {
  (projectData: Omit<ProjectOption, 'id'>): Promise<ProjectOption | null>;
}

export interface UseUpdateProjectReturn {
  (id: string, projectData: Partial<ProjectOption>): Promise<ProjectOption | null>;
}

export interface UseDeleteProjectReturn {
  (id: string): Promise<boolean>;
}
