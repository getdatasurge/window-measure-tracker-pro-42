
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface FilmRequiredFieldProps {
  watch: any;
  setValue: any;
}

const FilmRequiredField: React.FC<FilmRequiredFieldProps> = ({ watch, setValue }) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="filmRequired"
        checked={watch('filmRequired') !== false}
        onCheckedChange={(checked) => setValue('filmRequired', checked)}
      />
      <Label htmlFor="filmRequired">Film Required</Label>
    </div>
  );
};

export default FilmRequiredField;
