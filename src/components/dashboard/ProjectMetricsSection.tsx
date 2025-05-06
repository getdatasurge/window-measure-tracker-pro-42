
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: {
    value: string;
    positive: boolean;
  };
  description: string;
  colorAccent: string;
  testId?: string;
}

interface ProjectMetrics {
  activeProjects: number;
  upcomingProjects: number;
  windowsMeasured: number;
  pendingMeasurements: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, description, colorAccent, testId }) => {
  return (
    <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg overflow-hidden" data-testid={testId}>
      <CardContent className="p-0">
        <div className="flex items-stretch">
          <div className="py-4 px-5 flex-grow">
            <div className="text-sm font-medium text-zinc-400">{title}</div>
            <div className="mt-1 flex items-baseline">
              <span className="text-2xl font-semibold text-white">{value}</span>
              <span className={`ml-2 text-xs font-medium flex items-center ${trend.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-0.5">
                  <path fillRule="evenodd" d={trend.positive 
                    ? "M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" 
                    : "M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"} 
                  clipRule="evenodd" />
                </svg>
                {trend.value}
              </span>
            </div>
            <div className="mt-1 text-xs text-zinc-500">{description}</div>
          </div>
          <div className={`w-2 ${colorAccent}`}></div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectMetricsSection: React.FC = () => {
  const [metrics, setMetrics] = useState<ProjectMetrics>({
    activeProjects: 0,
    upcomingProjects: 0,
    windowsMeasured: 0,
    pendingMeasurements: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        
        // Active projects (status = 'active')
        const { count: activeProjectsCount, error: activeError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');
          
        if (activeError) throw activeError;
        
        // Upcoming projects (status = 'planning' or 'scheduled')
        const { count: upcomingProjectsCount, error: upcomingError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .in('status', ['planning', 'scheduled']);
          
        if (upcomingError) throw upcomingError;
        
        // Windows measured (count completed measurements)
        const { count: measuredCount, error: measuredError } = await supabase
          .from('measurements')
          .select('*', { count: 'exact', head: true })
          .not('width', 'is', null)
          .not('height', 'is', null);
          
        if (measuredError) throw measuredError;
        
        // Pending measurements
        const { count: pendingCount, error: pendingError } = await supabase
          .from('measurements')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
          
        if (pendingError) throw pendingError;
        
        setMetrics({
          activeProjects: activeProjectsCount || 0,
          upcomingProjects: upcomingProjectsCount || 0,
          windowsMeasured: measuredCount || 0,
          pendingMeasurements: pendingCount || 0
        });
      } catch (error) {
        console.error('Error fetching project metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard 
        title="Active Projects"
        value={loading ? "..." : metrics.activeProjects}
        trend={{ value: "8%", positive: true }}
        description="vs last month"
        colorAccent="bg-indigo-500/20"
        testId="kpi-active-projects"
      />
      
      <MetricCard 
        title="Upcoming Projects"
        value={loading ? "..." : metrics.upcomingProjects}
        trend={{ value: "3%", positive: true }}
        description="vs last month"
        colorAccent="bg-purple-500/20"
        testId="kpi-upcoming-projects"
      />
      
      <MetricCard 
        title="Windows Measured"
        value={loading ? "..." : metrics.windowsMeasured}
        trend={{ value: "12%", positive: true }}
        description="total measured"
        colorAccent="bg-emerald-500/20"
        testId="kpi-windows-measured"
      />
      
      <MetricCard 
        title="Pending Measurements"
        value={loading ? "..." : metrics.pendingMeasurements}
        trend={{ value: "5%", positive: false }}
        description="remaining to measure"
        colorAccent="bg-amber-500/20"
        testId="kpi-pending-measurements"
      />
    </div>
  );
};

export default ProjectMetricsSection;
