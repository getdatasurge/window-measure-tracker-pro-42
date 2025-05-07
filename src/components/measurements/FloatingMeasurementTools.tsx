
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PlusCircle, Ruler, BarChart3 } from 'lucide-react';

export function FloatingMeasurementTools() {
  const [isOpen, setIsOpen] = useState(false);

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
                  onClick={() => {
                    setIsOpen(false);
                    // Functionality to add measurement would go here
                  }}
                  className="flex items-center gap-2 p-3 text-left hover:bg-zinc-700 transition-colors text-white"
                >
                  <PlusCircle size={18} />
                  <span>Add Measurement</span>
                </button>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    // Functionality to select project would go here
                  }}
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
    </div>
  );
}
