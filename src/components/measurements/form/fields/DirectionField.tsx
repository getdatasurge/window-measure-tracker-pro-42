
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { DIRECTION_OPTIONS, Direction, DEFAULT_DIRECTION } from '@/constants/direction';

export interface DirectionFieldProps {
  watch: any;
  setValue: any;
  errors?: any; // Make errors optional to match AttributesFields usage
}

const DirectionField: React.FC<DirectionFieldProps> = ({ watch, setValue, errors }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="direction">Direction</Label>
      <Select
        value={watch('direction') || DEFAULT_DIRECTION}
        onValueChange={(value: Direction) => setValue('direction', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select direction" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
          {DIRECTION_OPTIONS.map((dir) => (
            <SelectItem key={dir} value={dir} className="text-white">
              {dir}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors?.direction && (
        <p className="text-xs text-red-500 mt-1">{errors.direction.message}</p>
      )}
    </div>
  );
};

export default DirectionField;
