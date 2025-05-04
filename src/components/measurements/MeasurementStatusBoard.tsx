import React, { useState, useEffect } from 'react';
import { Measurement, getMeasurementsForDay, getMeasurementsByStatus, getArchivedMeasurements } from '@/data/measurementsData';
import MeasurementFilterBar from './MeasurementFilterBar';
import WeeklyNavBar from './WeeklyNavBar';
import StatusColumn from './StatusColumn';
import EditMeasurementModal from './EditMeasurementModal';
import ArchivedMeasurementTable from './ArchivedMeasurementTable';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
const MeasurementStatusBoard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [allMeasurements, setAllMeasurements] = useState<Measurement[]>([]);
  const [currentMeasurement, setCurrentMeasurement] = useState<Measurement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize with today's measurements
  useEffect(() => {
    const measurementsForToday = getMeasurementsForDay(selectedDate);
    setMeasurements(measurementsForToday);
    setAllMeasurements(getArchivedMeasurements());
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
  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // In a real implementation, this would filter the measurements
    // For now, we'll just update based on the selected date
    const measurementsForDay = getMeasurementsForDay(selectedDate);
    setMeasurements(measurementsForDay);
  };
  return <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Work Schedule</h1>
          <p className="text-sm text-zinc-400">View and manage window measurements by date and status</p>
        </div>
        
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
    </div>;
};
export default MeasurementStatusBoard;