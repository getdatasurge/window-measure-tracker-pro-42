
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
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Dimensions</h3>
      
      {/* Width and Height */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width">Width (inches)</Label>
          <Input
            id="width"
            placeholder="Enter width"
            {...register('width', { 
              required: "Width is required", 
              pattern: {
                value: /^[0-9]*\.?[0-9]+$/,
                message: "Width must be a valid number"
              }
            })}
          />
          {errors.width && (
            <p className="text-sm text-red-500">{errors.width.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="height">Height (inches)</Label>
          <Input
            id="height"
            placeholder="Enter height"
            {...register('height', { 
              required: "Height is required", 
              pattern: {
                value: /^[0-9]*\.?[0-9]+$/,
                message: "Height must be a valid number"
              }
            })}
          />
          {errors.height && (
            <p className="text-sm text-red-500">{errors.height.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DimensionsFields;
