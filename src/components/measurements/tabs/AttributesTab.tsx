
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Measurement, Direction } from '@/data/measurementsData';

interface AttributesTabProps {
  formData: Measurement;
  updateFormData: (field: string, value: any) => void;
}

const directions: Direction[] = ['North', 'South', 'East', 'West', 'N/A'];

const AttributesTab: React.FC<AttributesTabProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity" className="text-sm text-zinc-400 mb-1 block">
            Quantity
          </Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => updateFormData('quantity', parseInt(e.target.value) || 1)}
            className="bg-zinc-800/50 border-zinc-700 text-white"
            min={1}
          />
        </div>
        
        <div>
          <Label htmlFor="direction" className="text-sm text-zinc-400 mb-1 block">
            Orientation
          </Label>
          <Select 
            value={formData.direction} 
            onValueChange={(value) => updateFormData('direction', value)}
          >
            <SelectTrigger id="direction" className="bg-zinc-800/50 border-zinc-700 text-white">
              <SelectValue placeholder="Select orientation" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              {directions.map((direction) => (
                <SelectItem key={direction} value={direction}>{direction}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes" className="text-sm text-zinc-400 mb-1 block">
          Condition Notes
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => updateFormData('notes', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white min-h-[150px]"
          placeholder="Add any notes about the condition or special considerations for this window..."
        />
      </div>
    </div>
  );
};

export default AttributesTab;
