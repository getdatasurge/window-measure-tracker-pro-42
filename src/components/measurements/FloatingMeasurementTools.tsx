
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import MeasurementEntryModal from './MeasurementEntryModal';
import { ProjectSelector } from './ProjectSelector';
import { MeasurementMenu } from './MeasurementMenu';
import { useMeasurementSave } from '@/hooks/useMeasurementSave';
import { Measurement } from '@/types/measurement';

export function FloatingMeasurementTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const navigate = useNavigate();
  const { saveMeasurement, isSaving } = useMeasurementSave();
  
  const handleAddMeasurement = () => {
    setIsOpen(false);
    setShowMeasurementModal(true);
  };
  
  const handleProjectMeasurements = () => {
    setIsOpen(false);
    setShowProjectSelector(true);
  };
  
  const handleMeasurementSave = async (measurement: Measurement) => {
    await saveMeasurement(measurement, () => {
      // Close the modal
      setShowMeasurementModal(false);
      // Navigate to measurements page to see the newly created measurement
      navigate('/measurements');
    });
  };
  
  const handleProjectSelect = (projectId: string) => {
    setShowProjectSelector(false);
    navigate(`/measurement-entries?project=${projectId}`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end gap-2">
        <MeasurementMenu 
          isOpen={isOpen}
          onAddMeasurement={handleAddMeasurement}
          onProjectMeasurements={handleProjectMeasurements}
        />
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all",
            isOpen && "ring-2 ring-green-400"
          )}
        >
          <span className="font-medium text-sm tracking-wide">MEASUREMENT TOOLS</span>
        </button>
      </div>
      
      {/* Project Selection Modal */}
      <ProjectSelector 
        open={showProjectSelector}
        onOpenChange={setShowProjectSelector}
        onProjectSelect={handleProjectSelect}
      />
      
      {/* Measurement Entry Modal */}
      {showMeasurementModal && (
        <MeasurementEntryModal
          isOpen={showMeasurementModal}
          onOpenChange={setShowMeasurementModal}
          onSave={handleMeasurementSave}
          mode="create"
          defaultValues={{}}
        />
      )}
    </div>
  );
}
