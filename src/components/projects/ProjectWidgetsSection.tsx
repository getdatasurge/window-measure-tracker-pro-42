
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface WidgetCardProps {
  title: string;
  children: React.ReactNode;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ title, children }) => {
  return (
    <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
        {children}
      </CardContent>
    </Card>
  );
};

const ProjectWidgetsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WidgetCard title="Measurement Statistics">
        <div className="text-zinc-400 text-sm">
          Measurement statistics will appear here in Phase 5.
        </div>
      </WidgetCard>
      
      <WidgetCard title="Recent Measurements">
        <div className="text-zinc-400 text-sm">
          Recent measurements will appear here in Phase 5.
        </div>
      </WidgetCard>
      
      <WidgetCard title="Team Activity">
        <div className="text-zinc-400 text-sm">
          Team activity feed will appear here in Phase 5.
        </div>
      </WidgetCard>
      
      <WidgetCard title="Upcoming Schedule">
        <div className="text-zinc-400 text-sm">
          Schedule information will appear here in Phase 5.
        </div>
      </WidgetCard>
    </div>
  );
};

export default ProjectWidgetsSection;
