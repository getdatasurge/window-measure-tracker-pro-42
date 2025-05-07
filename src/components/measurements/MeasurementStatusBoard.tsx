
import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Measurement } from '@/types/measurement';
import StatusColumn from './StatusColumn';
import MeasurementFilterBar from './MeasurementFilterBar';
import WeeklyNavBar from './WeeklyNavBar';
import EditMeasurementModal from './EditMeasurementModal';
import { AnimatePresence } from 'framer-motion';
import { useMeasurements } from '@/hooks/useMeasurements';
import { supabase } from '@/integrations/supabase/client';

interface FilterState {
  projectId: string | null;
  location: string | null;
  status: string | null;
  dateRange: { from: Date | null; to: Date | null } | null;
}

const MeasurementStatusBoard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState<FilterState>({
    projectId: null,
    location: null,
    status: null,
    dateRange: null,
  });
  const [editMeasurement, setEditMeasurement] = useState<Measurement | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
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
  
  // Save measurement to Supabase
  const handleSaveMeasurement = async (measurement: Measurement) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to save measurements.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSaving(true);
      console.log("Preparing measurement data for save:", measurement);
      
      // Parse numeric values to ensure they're saved as numbers
      const parseNumericValue = (value: string | undefined): number | null => {
        if (!value) return null;
        // Remove any non-numeric characters except decimal point
        const numericStr = value.replace(/[^0-9.]/g, '');
        const parsed = parseFloat(numericStr);
        return isNaN(parsed) ? null : parsed;
      };
      
      // Prepare data for database (converting to match DB schema)
      const measurementData = {
        project_id: measurement.projectId,
        location: measurement.location.trim(),
        width: parseNumericValue(measurement.width),
        height: parseNumericValue(measurement.height),
        depth: parseNumericValue(measurement.depth),
        area: parseNumericValue(measurement.area),
        quantity: measurement.quantity || 1,
        recorded_by: user.id,
        direction: measurement.direction?.toLowerCase() || null,
        notes: measurement.notes || '',
        status: measurement.status.toLowerCase(),
        measurement_date: measurement.measurementDate || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: user.id,
        photos: Array.isArray(measurement.photos) ? measurement.photos : [],
        film_required: measurement.film_required === undefined ? true : !!measurement.film_required,
      };
      
      // Validate required fields
      const requiredFields = ['project_id', 'location', 'width', 'height'];
      const missingFields = requiredFields.filter(field => !measurementData[field]);
      
      if (missingFields.length > 0) {
        const fieldNames = missingFields.map(f => f.replace('_', ' ')).join(', ');
        throw new Error(`Required fields missing: ${fieldNames}`);
      }
      
      console.log("Formatted measurement data:", measurementData);
      
      let result;
      
      if (measurement.id && editMeasurement) {
        console.log("Updating existing measurement with ID:", measurement.id);
        // Update existing measurement
        const { data, error } = await supabase
          .from('measurements')
          .update(measurementData)
          .eq('id', measurement.id)
          .select();
          
        if (error) {
          console.error("Supabase update error:", error);
          throw error;
        }
        
        console.log("Update successful:", data);
        result = data;
        
        toast({
          title: "Measurement updated",
          description: "The measurement has been successfully updated."
        });
      } else {
        console.log("Creating new measurement");
        // Create new measurement
        const { data, error } = await supabase
          .from('measurements')
          .insert(measurementData)
          .select();
          
        if (error) {
          console.error("Supabase insert error:", error);
          throw error;
        }
        
        console.log("Insert successful:", data);
        result = data;
        
        toast({
          title: "Measurement created",
          description: "The measurement has been successfully created."
        });
      }
      
      // Save last selected project to localStorage
      if (measurement.projectId && measurement.projectName) {
        localStorage.setItem('lastSelectedProject', JSON.stringify({
          id: measurement.projectId,
          name: measurement.projectName
        }));
      }
      
      // Explicitly refetch measurements to update the UI
      console.log("Refetching measurements after save");
      await refetchMeasurements();
      
      // Close the modal
      setEditModalOpen(false);
      
    } catch (err) {
      console.error('Error saving measurement:', err);
      toast({
        title: "Error saving measurement",
        description: err instanceof Error ? err.message : "Failed to save measurement. Please check your data and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle card click to edit measurement
  const handleCardClick = (measurement: Measurement) => {
    setEditMeasurement(measurement);
    setEditModalOpen(true);
  };

  // Handle new measurement creation
  const handleNewMeasurement = () => {
    setEditMeasurement(null);
    setEditModalOpen(true);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleFilterChange = (newFilter: Partial<FilterState>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

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

  // Helper function to determine which column a measurement belongs to
  const getMeasurementsForColumn = (columnName: string) => {
    switch (columnName) {
      case 'Measured':
        return filteredMeasurements.filter(m => 
          m.status.toLowerCase() === 'pending'
        );
      case 'Cut':
        return filteredMeasurements.filter(m => 
          m.status.toLowerCase() === 'film_cut'
        );
      case 'Installed / Completed':
        return filteredMeasurements.filter(m => 
          m.status.toLowerCase() === 'installed' || 
          m.status.toLowerCase() === 'completed'
        );
      default:
        return [];
    }
  };

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
      
      <div>
        <MeasurementFilterBar onFilterChange={handleFilterChange} />
        <WeeklyNavBar
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatePresence>
          {['Measured', 'Cut', 'Installed / Completed'].map(columnName => (
            <StatusColumn
              key={columnName}
              title={`${columnName} (${getMeasurementsForColumn(columnName).length})`}
              status={columnName as any}
              measurements={getMeasurementsForColumn(columnName)}
              onEditMeasurement={handleCardClick}
              color={
                columnName === 'Measured' ? 'bg-amber-500/30' : 
                columnName === 'Cut' ? 'bg-blue-500/30' : 
                'bg-green-500/30'
              }
            />
          ))}
        </AnimatePresence>
      </div>
      
      <EditMeasurementModal
        measurement={editMeasurement}
        open={editModalOpen}
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
