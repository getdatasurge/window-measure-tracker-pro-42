
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotesFieldProps {
  register: any;
}

const NotesField: React.FC<NotesFieldProps> = ({ register }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        placeholder="Additional notes or comments"
        {...register('notes')}
      />
    </div>
  );
};

export default NotesField;
