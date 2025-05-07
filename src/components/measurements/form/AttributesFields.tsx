import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Direction } from '@/types/measurement';

interface AttributesFieldsProps {
  register: any;
  watch: any;
  setValue: any;
  errors: {
    quantity?: { message?: string };
    location?: { message?: string };
  };
}

const AttributesFields: React.FC<AttributesFieldsProps> = ({ 
  register, 
  watch, 
  setValue,
  errors 
}) => {
  return (
    <>
      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="e.g. Living Room Window"
          {...register('location', { required: "Location is required" })}
        />
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>
      
      {/* Direction and Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="direction">Direction</Label>
          <Select
            value={watch('direction')}
            onValueChange={(value: Direction) => setValue('direction', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="North">North</SelectItem>
              <SelectItem value="South">South</SelectItem>
              <SelectItem value="East">East</SelectItem>
              <SelectItem value="West">West</SelectItem>
              <SelectItem value="N/A">N/A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            {...register('quantity', { 
              required: "Quantity is required",
              min: { value: 1, message: "Minimum quantity is 1" }
            })}
          />
          {errors.quantity && (
            <p className="text-sm text-red-500">{errors.quantity.message}</p>
          )}
        </div>
      </div>
      
      {/* Film Required */}
      <div className="flex items-center space-x-2">
        <Switch
          id="filmRequired"
          checked={watch('filmRequired')}
          onCheckedChange={(checked) => setValue('filmRequired', checked)}
        />
        <Label htmlFor="filmRequired">Film Required</Label>
      </div>
      
      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes or comments"
          {...register('notes')}
        />
      </div>
    </>
  );
};

export default AttributesFields;
