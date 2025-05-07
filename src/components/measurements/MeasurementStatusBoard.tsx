
import React, { useState, useCallback, useEffect } from 'react';
import { Measurement } from '@/types/measurement';
import { useMeasurements } from '@/hooks/useMeasurements';
import { MeasurementColumns } from './MeasurementColumns';
import { MeasurementFilter } from './MeasurementFilter';
import MeasurementEditModalWrapper from './board/MeasurementEditModalWrapper';
import { useMeasurementUpdate } from '@/hooks/useMeasurementUpdate';
import { useMeasurementSubscription } from '@/hooks/useMeasurementSubscription';
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

const MeasurementStatusBoard: React.FC = () => {
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
  
  // Use our real-time subscription hook
  const { 
    measurements, 
    refreshData,
    subscriptionState
  } = useMeasurementSubscription({
    projectId: filter.projectId || undefined,
    onInsert: (measurement) => {
      toast({
        title: "New measurement added",
        description: `${measurement.location} has been added.`
      });
    },
    onUpdate: (measurement) => {
      // Only show toast for significant updates, not just minor edits
      if (editMeasurement?.id !== measurement.id) { // Don't show toast for our own edits
        toast({
          title: "Measurement updated",
          description: `${measurement.location} has been updated.`
        });
      }
    },
    onDelete: (id) => {
      toast({
        title: "Measurement removed",
        description: "A measurement has been removed."
      });
    }
  });
  
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
      id: data.id || '', // Ensure id is not undefined
      projectId: data.projectId || '',
      projectName: data.projectName || '',
      location: data.location || '',
      width: data.width || '',
      height: data.height || '',
      area: data.area || '',
      quantity: data.quantity || 1,
      recordedBy: data.recordedBy || '',
      // Ensure direction is valid by casting it to Direction type
      direction: (data.direction as Direction) || 'N/A',
      notes: data.notes || '',
      film_required: data.filmRequired, // Map filmRequired to film_required
      status: data.status || 'Pending',
      photos: Array.isArray(data.photos) ? data.photos : [],
      updatedAt: data.updatedAt || new Date().toISOString(),
      updatedBy: data.updatedBy || '',
      recorded_by: data.recorded_by,
      installationDate: data.installationDate || '',
      input_source: data.input_source || 'manual',
      measurementDate: data.measurementDate || new Date().toISOString()
    };

    // The refetch will only happen after the save is complete
    await saveMeasurement(measurementToSave, async () => {
      // Explicitly refetch measurements to update the UI
      console.log("Refetching measurements after save");
      await refreshData();
      
      // Close the modal
      setEditModalOpen(false);
    });
  }, [saveMeasurement, refreshData]);
  
  // Handle manual refresh
  const handleManualRefresh = useCallback(async () => {
    const success = await refreshData();
    if (success) {
      toast({
        title: "Data refreshed",
        description: "Measurement data has been updated."
      });
    } else {
      toast({
        title: "Refresh failed",
        description: "Could not refresh measurement data. Please try again.",
        variant: "destructive"
      });
    }
  }, [refreshData, toast]);

  if (subscriptionState.lastError) {
    console.error("Subscription error:", subscriptionState.lastError);
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
          {subscriptionState.isConnected ? (
            <div className="flex items-center text-green-500 text-xs">
              <Wifi className="h-4 w-4 mr-1" />
              <span>Live</span>
            </div>
          ) : (
            <div className="flex items-center text-amber-500 text-xs">
              <WifiOff className="h-4 w-4 mr-1" />
              <span>Polling</span>
            </div>
          )}
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
