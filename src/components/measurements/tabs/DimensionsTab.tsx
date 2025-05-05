
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Measurement } from '@/data/measurementsData';

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
  const handleIncrementWidth = (increment: number) => {
    // Extract numeric value from the width (removing the " symbol)
    const currentWidth = parseFloat(formData.width.replace('"', '')) || 0;
    const newWidth = currentWidth + increment;
    updateFormData('width', `${newWidth.toFixed(2)}"`);
  };

  const handleIncrementHeight = (increment: number) => {
    // Extract numeric value from the height (removing the " symbol)
    const currentHeight = parseFloat(formData.height.replace('"', '')) || 0;
    const newHeight = currentHeight + increment;
    updateFormData('height', `${newHeight.toFixed(2)}"`);
  };

  // Handle direct input changes
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.includes('"')) {
      value = `${value}"`;
    }
    updateFormData('width', value);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.includes('"')) {
      value = `${value}"`;
    }
    updateFormData('height', value);
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
            className="bg-zinc-800/50 border-zinc-700 text-white"
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {fractions.map((fraction) => (
              <Button
                key={fraction.display}
                size="sm"
                variant="outline"
                className="h-7 px-2 py-1 text-xs bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
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
            className="bg-zinc-800/50 border-zinc-700 text-white"
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {fractions.map((fraction) => (
              <Button
                key={fraction.display}
                size="sm"
                variant="outline"
                className="h-7 px-2 py-1 text-xs bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
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
        <Input
          id="area"
          value={formData.area}
          readOnly
          disabled
          className="bg-zinc-800/50 border-zinc-700 text-white"
        />
        <p className="text-xs text-zinc-500 mt-1">
          Auto-calculated from width and height
        </p>
      </div>
    </div>
  );
};

export default DimensionsTab;
