
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormErrors } from '@/hooks/measurements/types';

interface LocationFieldProps {
  register: any;
  errors: FormErrors;
}

const LocationField: React.FC<LocationFieldProps> = ({ register, errors }) => {
  return (
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
  );
};

export default LocationField;
