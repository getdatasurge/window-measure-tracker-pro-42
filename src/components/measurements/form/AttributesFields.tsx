
import React from 'react';
import { FormErrors } from '@/hooks/measurements/types';
import LocationField from './fields/LocationField';
import DirectionField from './fields/DirectionField';
import QuantityField from './fields/QuantityField';
import FilmRequiredField from './fields/FilmRequiredField';
import NotesField from './fields/NotesField';
import InputSourceField from './fields/InputSourceField';

interface AttributesFieldsProps {
  register: any;
  watch: any;
  setValue: any;
  errors: FormErrors;
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
      <LocationField register={register} errors={errors} />
      
      {/* Direction and Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <DirectionField watch={watch} setValue={setValue} />
        <QuantityField register={register} errors={errors} />
      </div>
      
      {/* Film Required */}
      <FilmRequiredField watch={watch} setValue={setValue} />
      
      {/* Notes */}
      <NotesField register={register} />
      
      {/* Input Source - Hidden field that defaults to 'manual' */}
      <InputSourceField register={register} />
    </>
  );
};

export default AttributesFields;
