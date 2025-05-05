
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardKpiSection from '@/components/dashboard/DashboardKpiSection';
import DashboardChartsSection from '@/components/dashboard/DashboardChartsSection';
import DashboardActionsSection from '@/components/dashboard/DashboardActionsSection';
import DocumentationLinks from '@/components/dashboard/DocumentationLinks';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import withResponsiveLayout from '@/hoc/withResponsiveLayout';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <DashboardHeader 
        title="Knowledge Base Dashboard" 
        actionButton={
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FileText size={16} />
            Documentation
          </Button>
        }
      >
        {/* Empty children prop but now properly typed */}
      </DashboardHeader>
      
      <DashboardKpiSection />
      <DashboardChartsSection />
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Knowledge Base Documentation</h2>
        <DocumentationLinks />
      </div>
      
      <DashboardActionsSection onActionClick={() => {}} />
    </div>
  );
};

export default withResponsiveLayout(DashboardPage);
