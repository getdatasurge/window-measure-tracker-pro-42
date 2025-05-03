
import React from 'react';
import ActionCard from './ActionCard';
import { FileText, Calendar, BarChart2, PenLine } from 'lucide-react';

interface DashboardActionsSectionProps {
  onActionClick: (action: string) => void;
}

const DashboardActionsSection: React.FC<DashboardActionsSectionProps> = ({ onActionClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ActionCard
        title="Add New Measurement"
        description="Quickly add new window measurements to existing projects"
        buttonText="Start Measuring"
        icon={<PenLine size={24} />}
        onClick={() => onActionClick("New Measurement")}
        color="blue"
      />
      <ActionCard
        title="Create New Project"
        description="Set up a new window installation project from scratch"
        buttonText="New Project"
        icon={<FileText size={24} />}
        onClick={() => onActionClick("Create Project")}
        color="green"
      />
      <ActionCard
        title="Schedule Installation"
        description="Schedule installation teams for completed measurements"
        buttonText="Schedule Now"
        icon={<Calendar size={24} />}
        onClick={() => onActionClick("Schedule Installation")}
        color="orange"
      />
      <ActionCard
        title="Generate Reports"
        description="Create detailed reports of measurements and installations"
        buttonText="Create Report"
        icon={<BarChart2 size={24} />}
        onClick={() => onActionClick("Generate Reports")}
        color="purple"
      />
    </div>
  );
};

export default DashboardActionsSection;
