
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Ruler, BarChart3 } from 'lucide-react';

interface MeasurementMenuProps {
  isOpen: boolean;
  onAddMeasurement: () => void;
  onProjectMeasurements: () => void;
}

export function MeasurementMenu({ isOpen, onAddMeasurement, onProjectMeasurements }: MeasurementMenuProps) {
  return (
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
              onClick={onAddMeasurement}
              className="flex items-center gap-2 p-3 text-left hover:bg-zinc-700 transition-colors text-white"
            >
              <PlusCircle size={18} />
              <span>Add Measurement</span>
            </button>
            <button 
              onClick={onProjectMeasurements}
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
  );
}
