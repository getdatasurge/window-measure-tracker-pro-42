
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Measurement } from '@/data/measurementsData';

interface MeasurementDetailsTabProps {
  formData: Measurement;
  updateFormData: (field: string, value: any) => void;
}

const glassTypes = [
  'Clear',
  'Tinted',
  'Reflective',
  'Frosted',
  'Tempered',
  'Other',
];

const MeasurementDetailsTab: React.FC<MeasurementDetailsTabProps> = ({ formData, updateFormData }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="location" className="text-sm text-zinc-400 mb-1 block">
          Location
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => updateFormData('location', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white"
        />
      </div>
      
      <div>
        <Label htmlFor="measurementDate" className="text-sm text-zinc-400 mb-1 block">
          Measurement Date
        </Label>
        <Input
          id="measurementDate"
          type="date"
          value={formData.measurementDate}
          onChange={(e) => updateFormData('measurementDate', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white"
        />
      </div>
      
      <div>
        <Label htmlFor="recordedBy" className="text-sm text-zinc-400 mb-1 block">
          Recorded By
        </Label>
        <Input
          id="recordedBy"
          value={formData.recordedBy}
          onChange={(e) => updateFormData('recordedBy', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white"
        />
      </div>
      
      <div>
        <Label htmlFor="glassType" className="text-sm text-zinc-400 mb-1 block">
          Glass Type
        </Label>
        <Select 
          value={formData.glassType || ''} 
          onValueChange={(value) => updateFormData('glassType', value)}
        >
          <SelectTrigger id="glassType" className="bg-zinc-800/50 border-zinc-700 text-white">
            <SelectValue placeholder="Select glass type" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            {glassTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MeasurementDetailsTab;
