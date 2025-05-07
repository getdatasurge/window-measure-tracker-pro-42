
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Measurement } from '@/types/measurement';
import { useAuth } from '@/contexts/auth';

interface MeasurementDetailsTabProps {
  formData: Measurement;
  updateFormData: (field: string, value: any) => void;
  errors?: {[key: string]: string};
  setErrors?: (errors: {[key: string]: string}) => void;
}

const MeasurementDetailsTab: React.FC<MeasurementDetailsTabProps> = ({ 
  formData, 
  updateFormData,
  errors = {},
  setErrors = () => {}
}) => {
  const { profile } = useAuth();
  
  // Autofill recorded by field with current user's name when component mounts
  React.useEffect(() => {
    if (profile?.full_name && !formData.recordedBy) {
      updateFormData('recordedBy', profile.full_name);
    }
  }, [profile, formData.recordedBy, updateFormData]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFormData('location', value);
    
    // Clear error when user starts typing
    if (value && errors.location) {
      const newErrors = {...errors};
      delete newErrors.location;
      setErrors(newErrors);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm text-zinc-400">
          Location <span className="text-red-500">*</span>
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={handleLocationChange}
          className={`bg-zinc-800/50 border-zinc-700 text-white ${errors.location ? 'border-red-500' : ''}`}
          placeholder="Enter location (required)"
          required
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
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
