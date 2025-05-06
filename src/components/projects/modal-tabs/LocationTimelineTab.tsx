
// I'll add a TypeGuard function at the beginning of the file to safely access location fields
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { ProjectFormData } from '@/types/project';

// Type guard for location object
const isLocationObject = (location: any): location is {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
} => {
  return typeof location === 'object' && location !== null;
};

interface LocationTimelineTabProps {
  formData: ProjectFormData;
  updateFormData: (field: string, value: any) => void;
  errors: Partial<Record<string, string>>;
}

const LocationTimelineTab: React.FC<LocationTimelineTabProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const location = formData.location || {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: ''
  };
  
  const locationObj = isLocationObject(location) ? location : {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: ''
  };
  
  const handleLocationChange = (field: string, value: string) => {
    updateFormData(`location.${field}`, value);
  };

  // Format date for display
  const formatDate = (date: string | Date | null) => {
    if (!date) return 'Select date';
    return typeof date === 'string' ? format(new Date(date), 'PP') : format(date, 'PP');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Project Location</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="addressLine1" className="text-sm">Address Line 1</Label>
            <Input
              id="addressLine1"
              value={locationObj.addressLine1}
              onChange={(e) => handleLocationChange('addressLine1', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="123 Main St"
            />
            {errors['location.addressLine1'] && (
              <p className="text-red-500 text-xs mt-1">{errors['location.addressLine1']}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="addressLine2" className="text-sm">Address Line 2</Label>
            <Input
              id="addressLine2"
              value={locationObj.addressLine2}
              onChange={(e) => handleLocationChange('addressLine2', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Suite 101"
            />
          </div>
          
          <div>
            <Label htmlFor="city" className="text-sm">City</Label>
            <Input
              id="city"
              value={locationObj.city}
              onChange={(e) => handleLocationChange('city', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="New York"
            />
            {errors['location.city'] && (
              <p className="text-red-500 text-xs mt-1">{errors['location.city']}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="state" className="text-sm">State</Label>
            <Input
              id="state"
              value={locationObj.state}
              onChange={(e) => handleLocationChange('state', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="NY"
            />
            {errors['location.state'] && (
              <p className="text-red-500 text-xs mt-1">{errors['location.state']}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="zip" className="text-sm">ZIP Code</Label>
            <Input
              id="zip"
              value={locationObj.zip}
              onChange={(e) => handleLocationChange('zip', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="10001"
            />
            {errors['location.zip'] && (
              <p className="text-red-500 text-xs mt-1">{errors['location.zip']}</p>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Project Timeline</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-zinc-800 border-zinc-700 text-white justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.timeline && formatDate(formData.timeline.startDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-zinc-800 border-zinc-700 text-white p-0">
                <Calendar
                  mode="single"
                  selected={formData.timeline?.startDate ? new Date(formData.timeline.startDate) : undefined}
                  onSelect={(date) => updateFormData('timeline.startDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label className="text-sm">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-zinc-800 border-zinc-700 text-white justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.timeline && formatDate(formData.timeline.endDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-zinc-800 border-zinc-700 text-white p-0">
                <Calendar
                  mode="single"
                  selected={formData.timeline?.endDate ? new Date(formData.timeline.endDate) : undefined}
                  onSelect={(date) => updateFormData('timeline.endDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTimelineTab;
