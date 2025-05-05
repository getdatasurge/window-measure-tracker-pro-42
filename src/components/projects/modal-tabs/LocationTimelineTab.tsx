
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ProjectFormData } from '@/types/project';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface LocationTimelineTabProps {
  formData: ProjectFormData;
  updateFormData: (field: string, value: any) => void;
  errors: Partial<Record<string, string>>;
}

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 
  'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const LocationTimelineTab: React.FC<LocationTimelineTabProps> = ({ 
  formData, 
  updateFormData,
  errors
}) => {
  return (
    <div className="space-y-6">
      {/* Location Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <h3 className="text-sm font-medium text-white">Location Information</h3>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="addressLine1" className="text-sm text-zinc-400 flex items-center">
            Address Line 1 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="addressLine1"
            value={formData.location?.addressLine1 || ''}
            onChange={(e) => updateFormData('location.addressLine1', e.target.value)}
            className="bg-zinc-800/50 border-zinc-700 text-white"
            placeholder="Enter street address"
          />
          {errors['location.addressLine1'] && (
            <p className="text-xs text-red-500 mt-1">{errors['location.addressLine1']}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="addressLine2" className="text-sm text-zinc-400">
            Address Line 2
          </Label>
          <Input
            id="addressLine2"
            value={formData.location?.addressLine2 || ''}
            onChange={(e) => updateFormData('location.addressLine2', e.target.value)}
            className="bg-zinc-800/50 border-zinc-700 text-white"
            placeholder="Apt, Suite, Building (optional)"
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm text-zinc-400 flex items-center">
              City <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="city"
              value={formData.location?.city || ''}
              onChange={(e) => updateFormData('location.city', e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
              placeholder="City"
            />
            {errors['location.city'] && (
              <p className="text-xs text-red-500 mt-1">{errors['location.city']}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm text-zinc-400 flex items-center">
              State <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select 
              value={formData.location?.state || ''} 
              onValueChange={(value) => updateFormData('location.state', value)}
            >
              <SelectTrigger id="state" className="bg-zinc-800/50 border-zinc-700 text-white">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 h-[200px]">
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors['location.state'] && (
              <p className="text-xs text-red-500 mt-1">{errors['location.state']}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zip" className="text-sm text-zinc-400 flex items-center">
              ZIP Code <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="zip"
              value={formData.location?.zip || ''}
              onChange={(e) => updateFormData('location.zip', e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
              placeholder="ZIP Code"
            />
            {errors['location.zip'] && (
              <p className="text-xs text-red-500 mt-1">{errors['location.zip']}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Timeline Section */}
      <div className="space-y-4 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <h3 className="text-sm font-medium text-white">Timeline & Scheduling</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm text-zinc-400 flex items-center">
              Start Date <span className="text-red-500 ml-1">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="startDate"
                  variant={"outline"}
                  className={`w-full bg-zinc-800/50 border-zinc-700 text-white pl-3 text-left ${!formData.timeline?.startDate ? "text-zinc-500" : ""}`}
                >
                  {formData.timeline?.startDate ? (
                    format(new Date(formData.timeline.startDate), "PPP")
                  ) : (
                    <span>Select start date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.timeline?.startDate ? new Date(formData.timeline.startDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      updateFormData('timeline.startDate', date.toISOString());
                    }
                  }}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors['timeline.startDate'] && (
              <p className="text-xs text-red-500 mt-1">{errors['timeline.startDate']}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm text-zinc-400">
              Expected End Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="endDate"
                  variant={"outline"}
                  className={`w-full bg-zinc-800/50 border-zinc-700 text-white pl-3 text-left ${!formData.timeline?.endDate ? "text-zinc-500" : ""}`}
                >
                  {formData.timeline?.endDate ? (
                    format(new Date(formData.timeline.endDate), "PPP")
                  ) : (
                    <span>Select end date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.timeline?.endDate ? new Date(formData.timeline.endDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      updateFormData('timeline.endDate', date.toISOString());
                    }
                  }}
                  disabled={(date) => 
                    date < new Date("1900-01-01") || 
                    (formData.timeline?.startDate && date < new Date(formData.timeline.startDate))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="completionDate" className="text-sm text-zinc-400">
              Actual Completion Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="completionDate"
                  variant={"outline"}
                  className={`w-full bg-zinc-800/50 border-zinc-700 text-white pl-3 text-left ${!formData.timeline?.completionDate ? "text-zinc-500" : ""}`}
                >
                  {formData.timeline?.completionDate ? (
                    format(new Date(formData.timeline.completionDate), "PPP")
                  ) : (
                    <span>Select completion date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.timeline?.completionDate ? new Date(formData.timeline.completionDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      updateFormData('timeline.completionDate', date.toISOString());
                    }
                  }}
                  disabled={(date) => date < new Date("1900-01-01")}
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
