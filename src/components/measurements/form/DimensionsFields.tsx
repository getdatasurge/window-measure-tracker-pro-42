
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormErrors } from '@/hooks/measurements/types';

interface DimensionsFieldsProps {
  register: any;
  errors: FormErrors;
}

const DimensionsFields: React.FC<DimensionsFieldsProps> = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="width">Width (inches)</Label>
        <Input
          id="width"
          placeholder="Width"
          {...register('width', { required: "Width is required" })}
        />
        {errors.width && (
          <p className="text-sm text-red-500">{errors.width.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="height">Height (inches)</Label>
        <Input
          id="height"
          placeholder="Height"
          {...register('height', { required: "Height is required" })}
        />
        {errors.height && (
          <p className="text-sm text-red-500">{errors.height.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="depth">Depth (inches)</Label>
        <Input
          id="depth"
          placeholder="Depth (optional)"
          {...register('depth')}
        />
        {errors.depth && (
          <p className="text-sm text-red-500">{errors.depth.message}</p>
        )}
      </div>
    </div>
  );
};

export default DimensionsFields;
