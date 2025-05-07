
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PlusCircle, Ruler, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import MeasurementEntryModal from './MeasurementEntryModal';
import { generateNewMeasurement } from '@/utils/measurementUtils';
import { Measurement } from '@/types/measurement';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

export function FloatingMeasurementTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleAddMeasurement = () => {
    setIsOpen(false);
    setShowMeasurementModal(true);
  };
  
  const handleProjectMeasurements = () => {
    setIsOpen(false);
    setShowProjectSelector(true);
  };
  
  // Save measurement to Supabase
  const handleMeasurementSave = async (measurement: Measurement) => {
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
      console.log("FloatingTools - Preparing measurement data for save:", measurement);
      
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
      
      console.log("FloatingTools - Formatted measurement data:", measurementData);

      // Create new measurement
      const { data, error } = await supabase
        .from('measurements')
        .insert(measurementData)
        .select();
        
      if (error) {
        console.error("FloatingTools - Supabase insert error:", error);
        throw error;
      }
      
      console.log("FloatingTools - Insert successful:", data);
      
      toast({
        title: "Measurement saved",
        description: "Your measurement has been saved successfully.",
      });

      // Close the modal
      setShowMeasurementModal(false);

      // Navigate to measurements page to see the newly created measurement
      navigate('/measurements');
      
    } catch (err) {
      console.error('FloatingTools - Error saving measurement:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save measurement. Please check your data and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleProjectSelect = (projectId: string) => {
    setShowProjectSelector(false);
    navigate(`/measurement-entries?project=${projectId}`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end gap-2">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-800 rounded-lg shadow-lg mb-2 overflow-hidden"
            >
              <div className="flex flex-col w-60">
                <button 
                  onClick={handleAddMeasurement}
                  className="flex items-center gap-2 p-3 text-left hover:bg-zinc-700 transition-colors text-white"
                >
                  <PlusCircle size={18} />
                  <span>Add Measurement</span>
                </button>
                <button 
                  onClick={handleProjectMeasurements}
                  className="flex items-center gap-2 p-3 text-left hover:bg-zinc-700 transition-colors text-white"
                >
                  <Ruler size={18} />
                  <span>Project Measurements</span>
                </button>
                <button 
                  disabled
                  className="flex items-center gap-2 p-3 text-left text-zinc-500 opacity-70"
                >
                  <BarChart3 size={18} />
                  <span>Weekly Report (coming soon)</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
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
      <Dialog open={showProjectSelector} onOpenChange={setShowProjectSelector}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select a Project</h2>
            <p className="text-sm text-muted-foreground">
              Choose a project to view its measurements
            </p>
            <div className="flex flex-col space-y-2">
              {/* In a real implementation, these would be fetched from your API */}
              <Button variant="outline" onClick={() => handleProjectSelect('project-1')}>
                Main Street Windows
              </Button>
              <Button variant="outline" onClick={() => handleProjectSelect('project-2')}>
                Downtown Office Complex
              </Button>
              <Button variant="outline" onClick={() => handleProjectSelect('project-3')}>
                Residential Tower
              </Button>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setShowProjectSelector(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
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
