
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardKpiSection from '@/components/dashboard/DashboardKpiSection';
import DashboardChartsSection from '@/components/dashboard/DashboardChartsSection';
import DashboardActionsSection from '@/components/dashboard/DashboardActionsSection';
import DocumentationLinks from '@/components/dashboard/DocumentationLinks';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="flex flex-col gap-8 px-4 py-6 md:gap-12 md:px-6 lg:px-8">
        <DashboardHeader title="Knowledge Base Dashboard" actionButton={
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FileText size={16} />
            Documentation
          </Button>
        } />
        <DashboardKpiSection />
        <DashboardChartsSection />
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Knowledge Base Documentation</h2>
          <DocumentationLinks />
        </div>
        
        <DashboardActionsSection onActionClick={() => {}} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
