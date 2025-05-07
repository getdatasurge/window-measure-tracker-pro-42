
import React, { useState, useCallback } from 'react';
import { Measurement } from '@/types/measurement';
import { useMeasurements } from '@/hooks/useMeasurements';
import { MeasurementColumns } from './MeasurementColumns';
import { MeasurementFilter } from './MeasurementFilter';
import EditMeasurementModal from './EditMeasurementModal';
import { useMeasurementUpdate } from '@/hooks/useMeasurementUpdate';

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
  
  // Use our centralized hook for fetching measurements
  const { 
    measurements, 
    isLoading: loading, 
    error, 
    refetchMeasurements 
  } = useMeasurements({
    ...(filter.projectId ? { projectId: filter.projectId } : {}),
    ...(filter.dateRange?.from && filter.dateRange?.to ? { date: filter.dateRange.from } : {}),
  });

  // Use our custom hook for saving measurements
  const { saveMeasurement, isSaving } = useMeasurementUpdate();
  
  // Handle card click to edit measurement
  const handleCardClick = useCallback((measurement: Measurement) => {
    setEditMeasurement(measurement);
    setEditModalOpen(true);
  }, []);

  // Handle saving a measurement with sequential operations
  const handleSaveMeasurement = useCallback(async (measurement: Measurement) => {
    // The refetch will only happen after the save is complete
    await saveMeasurement(measurement, async () => {
      // Explicitly refetch measurements to update the UI
      console.log("Refetching measurements after save");
      await refetchMeasurements();
      
      // Close the modal
      setEditModalOpen(false);
    });
  }, [saveMeasurement, refetchMeasurements]);

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
    
    return true;
  });

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Error loading measurements: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Measurements</h1>
        <p className="text-sm text-zinc-400">
          Manage and track window measurements, monitor installation progress, and
          schedule tasks.
        </p>
      </div>
      
      <MeasurementFilter onFilterChange={setFilter} />
      
      <MeasurementColumns 
        filteredMeasurements={filteredMeasurements} 
        onEditMeasurement={handleCardClick} 
      />
      
      <EditMeasurementModal
        measurement={editMeasurement}
        isOpen={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleSaveMeasurement}
        defaultValues={{
          projectId: '',
          projectName: 'Select Project'
        }}
      />
    </div>
  );
};

export default MeasurementStatusBoard;
