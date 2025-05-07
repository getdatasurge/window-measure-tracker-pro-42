
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Measurement } from '@/types/measurement';

interface AttributesTabProps {
  formData: Measurement;
  updateFormData: (field: string, value: any) => void;
}

const AttributesTab: React.FC<AttributesTabProps> = ({ formData, updateFormData }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm text-zinc-400">
          Notes
        </Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => updateFormData('notes', e.target.value)}
          placeholder="Add any additional notes or specifications here..."
          className="h-32 bg-zinc-800/50 border-zinc-700 text-white"
        />
      </div>
    </div>
  );
};

export default AttributesTab;
