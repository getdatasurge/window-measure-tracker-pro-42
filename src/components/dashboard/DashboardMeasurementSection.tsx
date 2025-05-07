
import React from 'react';
import { Measurement } from '@/types/measurement';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MeasurementStatusBoard from '../measurements/MeasurementStatusBoard';

interface DashboardMeasurementSectionProps {
  measurements: Measurement[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const DashboardMeasurementSection: React.FC<DashboardMeasurementSectionProps> = ({
  measurements,
  isLoading,
  error,
  onRefresh
}) => {
  if (isLoading) {
    return (
      <Card className="border border-zinc-800 bg-zinc-900/50">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-red-800/50 bg-red-900/10">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle size={24} />
              <span>Error loading measurements</span>
            </div>
            <p className="text-zinc-400 text-sm max-w-md text-center">{error}</p>
            <Button 
              variant="outline" 
              onClick={onRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Pass measurements directly to MeasurementStatusBoard
  return <MeasurementStatusBoard measurements={measurements} onRefresh={onRefresh} />;
};

export default DashboardMeasurementSection;
