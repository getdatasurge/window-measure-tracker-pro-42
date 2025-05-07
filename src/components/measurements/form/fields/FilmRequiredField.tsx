
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export interface FilmRequiredFieldProps {
  watch: any;
  setValue: any;
  register?: any; // Make register optional to match AttributesFields usage
  errors?: any; // Add errors prop to match AttributesFields usage
}

const FilmRequiredField: React.FC<FilmRequiredFieldProps> = ({ 
  watch, 
  setValue,
  register, // This prop is now optional
  errors // This prop is now optional
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="filmRequired"
        checked={watch('filmRequired') !== false}
        onCheckedChange={(checked) => setValue('filmRequired', checked)}
      />
      <Label htmlFor="filmRequired">Film Required</Label>
      {errors?.filmRequired && (
        <p className="text-xs text-red-500 ml-2">{errors.filmRequired.message}</p>
      )}
    </div>
  );
};

export default FilmRequiredField;
