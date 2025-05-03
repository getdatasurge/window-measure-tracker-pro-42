import React from 'react';
import ProjectTable from '../projects/ProjectTable';
import DashboardHeader from './DashboardHeader';
import DashboardSearch from './DashboardSearch';
import DashboardPagination from './DashboardPagination';
import { Project } from '../projects/ProjectTable';
interface DashboardProjectsSectionProps {
  projects: Project[];
}
const DashboardProjectsSection: React.FC<DashboardProjectsSectionProps> = ({
  projects
}) => {
  return;
};
export default DashboardProjectsSection;