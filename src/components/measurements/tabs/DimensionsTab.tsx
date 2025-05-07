
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Measurement } from '@/types/measurement';
import { motion } from 'framer-motion';

interface DimensionsTabProps {
  formData: Measurement;
  updateFormData: (field: string, value: any) => void;
}

// Fractions for the increment buttons
const fractions = [
  { display: '1/8', value: 0.125 },
  { display: '1/4', value: 0.25 },
  { display: '3/8', value: 0.375 },
  { display: '1/2', value: 0.5 },
  { display: '5/8', value: 0.625 },
  { display: '3/4', value: 0.75 },
  { display: '7/8', value: 0.875 },
];

const DimensionsTab: React.FC<DimensionsTabProps> = ({ 
  formData, 
  updateFormData 
}) => {
  const [areaUpdated, setAreaUpdated] = useState(false);
  const [lastWidthFraction, setLastWidthFraction] = useState<number | null>(null);
  const [lastHeightFraction, setLastHeightFraction] = useState<number | null>(null);

  // Load saved fractions from localStorage
  useEffect(() => {
    const savedWidthFraction = localStorage.getItem('lastWidthFraction');
    const savedHeightFraction = localStorage.getItem('lastHeightFraction');
    
    if (savedWidthFraction) {
      setLastWidthFraction(parseFloat(savedWidthFraction));
    }
    
    if (savedHeightFraction) {
      setLastHeightFraction(parseFloat(savedHeightFraction));
    }
  }, []);

  const formatNumericValue = (value: string): string => {
    // Remove any non-numeric characters except decimal point
    const numericStr = value.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(numericStr);
    if (isNaN(parsed)) return '';
    return parsed.toFixed(2);
  };

  const handleIncrementWidth = (increment: number) => {
    // Save the last used fraction to localStorage
    localStorage.setItem('lastWidthFraction', increment.toString());
    setLastWidthFraction(increment);
    
    // Extract numeric value from the width (removing the " symbol)
    const currentWidth = parseFloat(formData.width.replace('"', '')) || 0;
    const newWidth = currentWidth + increment;
    updateFormData('width', `${formatNumericValue(newWidth.toString())}"`);
    triggerAreaAnimation();
  };

  const handleIncrementHeight = (increment: number) => {
    // Save the last used fraction to localStorage
    localStorage.setItem('lastHeightFraction', increment.toString());
    setLastHeightFraction(increment);
    
    // Extract numeric value from the height (removing the " symbol)
    const currentHeight = parseFloat(formData.height.replace('"', '')) || 0;
    const newHeight = currentHeight + increment;
    updateFormData('height', `${formatNumericValue(newHeight.toString())}"`);
    triggerAreaAnimation();
  };

  // Handle direct input changes
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Allow only numbers and decimal points
    value = value.replace(/[^0-9.]/g, '');
    if (value && !value.includes('"')) {
      value = `${formatNumericValue(value)}"`;
    }
    updateFormData('width', value);
    triggerAreaAnimation();
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Allow only numbers and decimal points
    value = value.replace(/[^0-9.]/g, '');
    if (value && !value.includes('"')) {
      value = `${formatNumericValue(value)}"`;
    }
    updateFormData('height', value);
    triggerAreaAnimation();
  };
  
  // Trigger animation when area updates
  const triggerAreaAnimation = () => {
    setAreaUpdated(true);
    setTimeout(() => setAreaUpdated(false), 1000);
  };

  // Handle keyboard shortcuts for fractions
  const handleKeyDown = (e: React.KeyboardEvent, field: 'width' | 'height') => {
    // Number keys 1-7 correspond to fractions
    if (e.key >= '1' && e.key <= '7' && e.altKey) {
      e.preventDefault();
      const index = parseInt(e.key) - 1;
      if (index >= 0 && index < fractions.length) {
        if (field === 'width') {
          handleIncrementWidth(fractions[index].value);
        } else {
          handleIncrementHeight(fractions[index].value);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width" className="text-sm text-zinc-400">
            Width (inches)
          </Label>
          <Input
            id="width"
            value={formData.width.replace('"', '')}
            onChange={handleWidthChange}
            onKeyDown={(e) => handleKeyDown(e, 'width')}
            className="bg-zinc-800/50 border-zinc-700 text-white"
            type="number"
            step="0.01"
            min="0"
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {fractions.map((fraction) => (
              <Button
                key={fraction.display}
                size="sm"
                variant="outline"
                data-width-fraction={fraction.value.toString()}
                className={`h-7 px-2 py-1 text-xs bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white ${lastWidthFraction === fraction.value ? 'bg-zinc-700 border-zinc-500' : ''}`}
                onClick={() => handleIncrementWidth(fraction.value)}
              >
                {fraction.display}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm text-zinc-400">
            Height (inches)
          </Label>
          <Input
            id="height"
            value={formData.height.replace('"', '')}
            onChange={handleHeightChange}
            onKeyDown={(e) => handleKeyDown(e, 'height')}
            className="bg-zinc-800/50 border-zinc-700 text-white"
            type="number"
            step="0.01"
            min="0"
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {fractions.map((fraction) => (
              <Button
                key={fraction.display}
                size="sm"
                variant="outline"
                data-height-fraction={fraction.value.toString()}
                className={`h-7 px-2 py-1 text-xs bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white ${lastHeightFraction === fraction.value ? 'bg-zinc-700 border-zinc-500' : ''}`}
                onClick={() => handleIncrementHeight(fraction.value)}
              >
                {fraction.display}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="area" className="text-sm text-zinc-400">
          Area (sq ft)
        </Label>
        <motion.div
          animate={areaUpdated ? { 
            backgroundColor: ['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0)'],
            transition: { duration: 1 }
          } : {}}
          className="rounded"
        >
          <Input
            id="area"
            value={formData.area}
            readOnly
            disabled
            className="bg-zinc-800/50 border-zinc-700 text-white"
          />
        </motion.div>
        <p className="text-xs text-zinc-500 mt-1">
          Auto-calculated from width and height (Alt + 1-7 to use keyboard shortcuts for fractions)
        </p>
      </div>
    </div>
  );
};

export default DimensionsTab;
