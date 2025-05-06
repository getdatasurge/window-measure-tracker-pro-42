
import React, { useState, useEffect } from 'react';
import { Measurement } from '@/types/measurement';
import { fetchMeasurementsForDay, fetchMeasurements } from '@/utils/measurementUtils';
import MeasurementFilterBar from './MeasurementFilterBar';
import WeeklyNavBar from './WeeklyNavBar';
import StatusColumn from './StatusColumn';
import EditMeasurementModal from './EditMeasurementModal';
import ArchivedMeasurementTable from './ArchivedMeasurementTable';
import { Button } from '@/components/ui/button';
import { Filter, Plus } from 'lucide-react';
import MeasurementEntryModal from './MeasurementEntryModal';

const MeasurementStatusBoard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [allMeasurements, setAllMeasurements] = useState<Measurement[]>([]);
  const [currentMeasurement, setCurrentMeasurement] = useState<Measurement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewMeasurementModalOpen, setIsNewMeasurementModalOpen] = useState(false);
  const [contextualDefaultValues, setContextualDefaultValues] = useState<Partial<Measurement>>({});
  const [loading, setLoading] = useState(false);

  // Initialize with today's measurements
  useEffect(() => {
    const loadMeasurements = async () => {
      setLoading(true);
      try {
        const measurementsForToday = await fetchMeasurementsForDay(selectedDate);
        setMeasurements(measurementsForToday);
        
        const allMeasurementsData = await fetchMeasurements();
        setAllMeasurements(allMeasurementsData);
        
        // Update contextual default values based on selected date
        setContextualDefaultValues(prev => ({
          ...prev,
          measurementDate: selectedDate.toISOString().split('T')[0]
        }));
      } catch (error) {
        console.error("Error loading measurements:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMeasurements();
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEditMeasurement = (measurement: Measurement) => {
    setCurrentMeasurement(measurement);
    setIsModalOpen(true);
  };

  const handleSaveMeasurement = (updatedMeasurement: Measurement) => {
    // Update the measurement in the state
    setMeasurements(prevMeasurements => prevMeasurements.map(m => m.id === updatedMeasurement.id ? updatedMeasurement : m));
  };

  const handleNewMeasurement = (newMeasurement: Measurement) => {
    // Add the new measurement to the state
    setMeasurements(prevMeasurements => [...prevMeasurements, newMeasurement]);
    setAllMeasurements(prevMeasurements => [...prevMeasurements, newMeasurement]);
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // In a real implementation, this would filter the measurements
    // For now, we'll just update based on the selected date
    const loadFilteredMeasurements = async () => {
      setLoading(true);
      try {
        const measurementsForDay = await fetchMeasurementsForDay(selectedDate);
        setMeasurements(measurementsForDay);
        
        // Update contextual default values based on filters
        if (filters.location) {
          setContextualDefaultValues(prev => ({
            ...prev,
            location: filters.location
          }));
        }
        
        if (filters.projectId) {
          setContextualDefaultValues(prev => ({
            ...prev,
            projectId: filters.projectId
          }));
        }
      } catch (error) {
        console.error("Error loading filtered measurements:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFilteredMeasurements();
  };

  const openNewMeasurementModal = () => {
    setIsNewMeasurementModalOpen(true);
  };

  return <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Work Schedule</h1>
          <p className="text-sm text-zinc-400">View and manage window measurements by date and status</p>
        </div>
        
        <Button 
          onClick={openNewMeasurementModal} 
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          New Measurement
        </Button>
      </div>
      
      <MeasurementFilterBar onFilterChange={handleFilterChange} />
      
      <WeeklyNavBar onSelectDate={handleDateSelect} selectedDate={selectedDate} />
      
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{
        minHeight: "500px"
      }}>
          <StatusColumn title="Measured" status="Pending" measurements={measurements} onEditMeasurement={handleEditMeasurement} color="bg-amber-600/20 text-amber-500" />
          <StatusColumn title="Cut" status="Film Cut" measurements={measurements} onEditMeasurement={handleEditMeasurement} color="bg-blue-600/20 text-blue-500" />
          <StatusColumn title="Installed" status="Installed" measurements={measurements} onEditMeasurement={handleEditMeasurement} color="bg-green-600/20 text-green-500" />
        </div>
      </div>
      
      <ArchivedMeasurementTable measurements={allMeasurements} />
      
      {currentMeasurement && <EditMeasurementModal measurement={currentMeasurement} open={isModalOpen} onOpenChange={setIsModalOpen} onSave={handleSaveMeasurement} />}
      
      {/* New Measurement Modal with contextual default values */}
      <MeasurementEntryModal 
        isOpen={isNewMeasurementModalOpen}
        onOpenChange={setIsNewMeasurementModalOpen}
        onSave={handleNewMeasurement}
        mode="create"
        defaultValues={contextualDefaultValues}
      />
    </div>;
};

export default MeasurementStatusBoard;
