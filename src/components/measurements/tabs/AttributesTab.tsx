
import React from 'react';
import { MeasurementFormData } from '@/hooks/measurements/types';
import { 
  Label,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea
} from "@/components/ui";
import { DIRECTION_OPTIONS, Direction, DEFAULT_DIRECTION } from '@/constants/direction';

interface AttributesTabProps {
  formData: MeasurementFormData;
  updateFormData: (field: string, value: any) => void;
}

const AttributesTab: React.FC<AttributesTabProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm text-zinc-400">Location</Label>
        <Input
          id="location"
          value={formData.location || ''}
          onChange={(e) => updateFormData('location', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white"
          placeholder="e.g. Living Room Window"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="direction" className="text-sm text-zinc-400">Direction</Label>
          <Select
            value={formData.direction || DEFAULT_DIRECTION} 
            onValueChange={(value: Direction) => updateFormData('direction', value)}
          >
            <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
              {DIRECTION_OPTIONS.map((direction) => (
                <SelectItem key={direction} value={direction} className="text-white">
                  {direction}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-sm text-zinc-400">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            value={formData.quantity || 1}
            onChange={(e) => updateFormData('quantity', Number(e.target.value))}
            className="bg-zinc-800/50 border-zinc-700 text-white"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.filmRequired !== false}
          onCheckedChange={(checked) => updateFormData('filmRequired', checked)}
          id="film-required"
        />
        <Label htmlFor="film-required" className="text-sm text-zinc-400">Film Required</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm text-zinc-400">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => updateFormData('notes', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white min-h-[100px]"
          placeholder="Additional notes or special instructions"
        />
      </div>
    </div>
  );
};

export default AttributesTab;
