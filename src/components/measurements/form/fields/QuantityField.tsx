
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormErrors } from '@/hooks/measurements/types';

interface QuantityFieldProps {
  register: any;
  errors: FormErrors;
}

const QuantityField: React.FC<QuantityFieldProps> = ({ register, errors }) => {
  return (
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
  );
};

export default QuantityField;
