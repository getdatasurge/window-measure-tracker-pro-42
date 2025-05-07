
import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DirectionField from './fields/DirectionField';
import FilmRequiredField from './fields/FilmRequiredField';

interface AttributesFieldsProps {
  register: any;
  watch: any;
  setValue: any;
  errors: any;
}

const AttributesFields = forwardRef<HTMLInputElement, AttributesFieldsProps>(({ 
  register, 
  watch, 
  setValue, 
  errors 
}, ref) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium">
          Location <span className="text-red-500">*</span>
        </Label>
        <Input
          id="location"
          placeholder="e.g. Living Room - North Wall"
          className={`${errors.location ? 'border-red-500' : ''}`}
          {...register('location', {
            required: 'Location is required'
          })}
          ref={ref}
          aria-invalid={errors.location ? 'true' : 'false'}
          aria-describedby="location-error"
        />
        {errors.location && (
          <p id="location-error" className="text-xs text-red-500 mt-1">{errors.location.message}</p>
        )}
      </div>

      <DirectionField
        watch={watch}
        setValue={setValue}
        errors={errors}
      />

      <FilmRequiredField 
        watch={watch}
        setValue={setValue}
        errors={errors}
      />

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any additional information..."
          {...register('notes')}
        />
      </div>
    </>
  );
});

AttributesFields.displayName = 'AttributesFields';

export default AttributesFields;
