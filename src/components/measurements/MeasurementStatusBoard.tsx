
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Measurement } from '@/types/measurement';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import StatusColumn from './StatusColumn';
import MeasurementFilterBar from './MeasurementFilterBar';
import WeeklyNavBar from './WeeklyNavBar';
import EditMeasurementModal from './EditMeasurementModal';
import { AnimatePresence } from 'framer-motion';

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
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [filteredMeasurements, setFilteredMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editMeasurement, setEditMeasurement] = useState<Measurement | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch measurements from Supabase
  const fetchMeasurements = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('measurements')
        .select(`
          *,
          projects:project_id (name)
        `)
        .eq('deleted', false)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      // Process the data to match our frontend schema
      const processedData: Measurement[] = data.map(item => ({
        id: item.id,
        projectId: item.project_id,
        projectName: item.projects?.name || 'Unknown Project',
        location: item.location || '',
        width: typeof item.width === 'number' ? `${item.width}"` : (item.width || '0"'),
        height: typeof item.height === 'number' ? `${item.height}"` : (item.height || '0"'),
        depth: item.depth ? `${item.depth}"` : undefined,
        area: item.area ? `${item.area} ft²` : '0 ft²',
        quantity: item.quantity || 1,
        recordedBy: item.recorded_by || '',
        direction: (item.direction || 'N/A') as any,
        notes: item.notes,
        status: (item.status || 'Pending') as any,
        measurementDate: item.measurement_date || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
        updatedBy: item.updated_by,
        photos: item.photos || [],
      }));
      
      setMeasurements(processedData);
      setFilteredMeasurements(processedData);
    } catch (err) {
      console.error('Error fetching measurements:', err);
      setError(err instanceof Error ? err : new Error('Failed to load measurements'));
      toast({
        title: "Error",
        description: "Failed to load measurements. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchMeasurements();
    
    // Set up real-time subscription for measurements changes
    const channel = supabase
      .channel('public:measurements')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'measurements' }, 
        (payload) => {
          console.log('Measurement change detected:', payload);
          fetchMeasurements(); // Refresh all measurements
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMeasurements]);

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
      // Prepare data for database (converting to match DB schema)
      const measurementData = {
        project_id: measurement.projectId,
        location: measurement.location,
        width: parseFloat(measurement.width.replace('"', '')),
        height: parseFloat(measurement.height.replace('"', '')),
        depth: measurement.depth ? parseFloat(measurement.depth.replace('"', '')) : null,
        area: parseFloat(measurement.area.replace(' ft²', '')),
        quantity: measurement.quantity,
        recorded_by: user.id, // Store user ID in recorded_by
        direction: measurement.direction,
        notes: measurement.notes,
        status: measurement.status.toLowerCase(),
        measurement_date: measurement.measurementDate,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
        photos: measurement.photos || [],
      };
      
      let result;
      
      if (measurement.id && editMeasurement) {
        // Update existing measurement
        const { data, error } = await supabase
          .from('measurements')
          .update(measurementData)
          .eq('id', measurement.id)
          .select();
          
        if (error) throw error;
        result = data;
        
        toast({
          title: "Measurement updated",
          description: "The measurement has been successfully updated."
        });
      } else {
        // Create new measurement
        const { data, error } = await supabase
          .from('measurements')
          .insert(measurementData)
          .select();
          
        if (error) throw error;
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
      
      // Refresh measurements
      fetchMeasurements();
      
    } catch (err) {
      console.error('Error saving measurement:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save measurement.",
        variant: "destructive"
      });
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

  useEffect(() => {
    // Apply filters to measurements
    let filtered = [...measurements];

    if (filter.projectId) {
      filtered = filtered.filter(m => m.projectId === filter.projectId);
    }

    if (filter.location) {
      filtered = filtered.filter(m =>
        m.location.toLowerCase().includes(filter.location!.toLowerCase())
      );
    }

    if (filter.status) {
      filtered = filtered.filter(m => m.status === filter.status);
    }

    if (filter.dateRange?.from && filter.dateRange?.to) {
      filtered = filtered.filter(m => {
        const measurementDate = new Date(m.measurementDate);
        return (
          measurementDate >= filter.dateRange!.from! &&
          measurementDate <= filter.dateRange!.to!
        );
      });
    }

    setFilteredMeasurements(filtered);
  }, [measurements, filter]);

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
