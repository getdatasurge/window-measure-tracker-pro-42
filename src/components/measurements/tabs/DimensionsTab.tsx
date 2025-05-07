import React from 'react';
import { MeasurementFormData } from '@/hooks/measurements/types';
import { 
  Label,
  Input
} from "@/components/ui";

interface DimensionsTabProps {
  formData: MeasurementFormData;
  updateFormData: (field: string, value: any) => void;
}

const DimensionsTab: React.FC<DimensionsTabProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width" className="text-sm text-zinc-400">Width (in inches)</Label>
          <Input
            id="width"
            type="number"
            placeholder="Enter width"
            value={formData.width || ''}
            onChange={(e) => updateFormData('width', e.target.value)}
            className="bg-zinc-800/50 border-zinc-700 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm text-zinc-400">Height (in inches)</Label>
          <Input
            id="height"
            type="number"
            placeholder="Enter height"
            value={formData.height || ''}
            onChange={(e) => updateFormData('height', e.target.value)}
            className="bg-zinc-800/50 border-zinc-700 text-white"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="area" className="text-sm text-zinc-400">Area (sq feet)</Label>
        <Input
          id="area"
          type="number"
          placeholder="Area will be calculated automatically"
          value={formData.area || ''}
          readOnly
          className="bg-zinc-800/50 border-zinc-700 text-white"
        />
      </div>
    </div>
  );
};

export default DimensionsTab;
