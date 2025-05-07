
import React from 'react';
import { Measurement, Direction } from '@/types/measurement';
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

interface AttributesTabProps {
  formData: Measurement;
  updateFormData: (field: string, value: any) => void;
}

const AttributesTab: React.FC<AttributesTabProps> = ({ formData, updateFormData }) => {
  // Define the valid direction options based on the type definition
  const directionOptions: Direction[] = ['North', 'South', 'East', 'West', 'N/A'];
  
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
            value={formData.direction || 'N/A'} 
            onValueChange={(value: Direction) => updateFormData('direction', value)}
          >
            <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
              {directionOptions.map((direction) => (
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
          checked={formData.film_required !== false}
          onCheckedChange={(checked) => updateFormData('film_required', checked)}
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
