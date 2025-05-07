
import React, { useState, useCallback } from 'react';
import { Measurement } from '@/types/measurement';
import { MeasurementColumns } from './MeasurementColumns';
import { MeasurementFilter } from './MeasurementFilter';
import MeasurementEditModalWrapper from './board/MeasurementEditModalWrapper';
import { useMeasurementUpdate } from '@/hooks/useMeasurementUpdate';
import { useToast } from '@/hooks/use-toast';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MeasurementFormData } from '@/hooks/measurements/types';
import { Direction } from '@/constants/direction';

interface FilterState {
  projectId: string | null;
  location: string | null;
  status: string | null;
  dateRange: { from: Date | null; to: Date | null } | null;
}

interface MeasurementStatusBoardProps {
  measurements: Measurement[];
  onRefresh: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const MeasurementStatusBoard: React.FC<MeasurementStatusBoardProps> = ({ 
  measurements, 
  onRefresh,
  isLoading = false,
  error = null
}) => {
  const [filter, setFilter] = useState<FilterState>({
    projectId: null,
    location: null,
    status: null,
    dateRange: null,
  });
  const [editMeasurement, setEditMeasurement] = useState<Measurement | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Use our custom hook for saving measurements
  const { saveMeasurement, isSaving } = useMeasurementUpdate();
  
  // Filter measurements based on search criteria
  const filteredMeasurements = measurements.filter(m => {
    // Filter by location if specified
    if (filter.location && !m.location.toLowerCase().includes(filter.location.toLowerCase())) {
      return false;
    }
    
    // Filter by status if specified
    if (filter.status && m.status !== filter.status) {
      return false;
    }
    
    // Filter by date range if specified
    if (filter.dateRange?.from && filter.dateRange?.to) {
      const measurementDate = new Date(m.measurementDate);
      const fromDate = filter.dateRange.from;
      const toDate = filter.dateRange.to;
      
      if (measurementDate < fromDate || measurementDate > toDate) {
        return false;
      }
    }
    
    return true;
  });
  
  // Handle card click to edit measurement
  const handleCardClick = useCallback((measurement: Measurement) => {
    setEditMeasurement(measurement);
    setEditModalOpen(true);
  }, []);

  // Handle saving a measurement
  const handleSaveMeasurement = useCallback(async (data: MeasurementFormData & { recorded_by?: string }) => {
    // Convert MeasurementFormData to Measurement for saveMeasurement function
    const measurementToSave: Measurement = {
      id: data.id || '', 
      projectId: data.projectId || '',
      projectName: data.projectName || '',
      location: data.location || '',
      width: data.width || '',
      height: data.height || '',
      area: data.area || '',
      quantity: data.quantity || 1,
      recordedBy: data.recordedBy || '',
      direction: (data.direction as Direction) || 'N/A',
      notes: data.notes || '',
      film_required: data.filmRequired, 
      status: data.status || 'Pending',
      photos: Array.isArray(data.photos) ? data.photos : [],
      updatedAt: data.updatedAt || new Date().toISOString(),
      updatedBy: data.updatedBy || '',
      recorded_by: data.recorded_by,
      installationDate: data.installationDate || '',
      input_source: data.input_source || 'manual',
      measurementDate: data.measurementDate || new Date().toISOString()
    };

    try {
      // The refetch will only happen after the save is complete
      await saveMeasurement(measurementToSave);
      
      // Explicitly refetch measurements to update the UI
      console.log("Refetching measurements after save");
      onRefresh();
      
      // Close the modal
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error saving measurement:", error);
      toast({
        title: "Error",
        description: "Failed to save measurement",
        variant: "destructive"
      });
    }
  }, [saveMeasurement, onRefresh, toast]);
  
  // Handle manual refresh
  const handleManualRefresh = useCallback(() => {
    onRefresh();
    toast({
      title: "Data refreshed",
      description: "Measurement data has been updated."
    });
  }, [onRefresh, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-400">Error loading measurements: {error}</div>
        <Button 
          variant="outline" 
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Measurements</h1>
          <p className="text-sm text-zinc-400">
            Manage and track window measurements, monitor installation progress, and
            schedule tasks.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleManualRefresh} 
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>
      
      <MeasurementFilter onFilterChange={setFilter} />
      
      <MeasurementColumns 
        filteredMeasurements={filteredMeasurements} 
        onEditMeasurement={handleCardClick} 
      />
      
      {editMeasurement && (
        <MeasurementEditModalWrapper
          measurement={editMeasurement}
          isOpen={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSave={handleSaveMeasurement}
        />
      )}
    </div>
  );
};

export default MeasurementStatusBoard;
