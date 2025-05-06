
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Measurement } from '@/types/measurement';
import { useAuth } from '@/contexts/auth';

interface MeasurementDetailsTabProps {
  formData: Measurement;
  updateFormData: (field: string, value: any) => void;
}

const MeasurementDetailsTab: React.FC<MeasurementDetailsTabProps> = ({ 
  formData, 
  updateFormData 
}) => {
  const { profile } = useAuth();
  
  // Autofill recorded by field with current user's name when component mounts
  React.useEffect(() => {
    if (profile?.full_name && !formData.recordedBy) {
      updateFormData('recordedBy', profile.full_name);
    }
  }, [profile, formData.recordedBy, updateFormData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm text-zinc-400">
          Location
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => updateFormData('location', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white"
          placeholder="Enter location"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="measurementDate" className="text-sm text-zinc-400">
          Measurement Date
        </Label>
        <Input
          id="measurementDate"
          type="date"
          value={formData.measurementDate}
          onChange={(e) => updateFormData('measurementDate', e.target.value)}
          className="bg-zinc-800/50 border-zinc-700 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="recordedBy" className="text-sm text-zinc-400">
          Recorded By
        </Label>
        <Input
          id="recordedBy"
          value={formData.recordedBy}
          readOnly
          className="bg-zinc-800/50 border-zinc-700 text-white opacity-70"
          placeholder="Automatically filled"
        />
      </div>
    </div>
  );
};

export default MeasurementDetailsTab;
