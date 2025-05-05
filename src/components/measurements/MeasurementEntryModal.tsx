
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import MeasurementDetailsTab from './tabs/MeasurementDetailsTab';
import DimensionsTab from './tabs/DimensionsTab';
import AttributesTab from './tabs/AttributesTab';
import StatusWorkflowTab from './tabs/StatusWorkflowTab';
import { Measurement } from '@/data/measurementsData';

type MeasurementEntryModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  measurement?: Measurement; // For edit mode
  onSave: (measurement: Measurement) => void;
  mode: 'create' | 'edit';
};

const generateNewMeasurement = (): Measurement => {
  const now = new Date().toISOString();
  return {
    id: `WM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    projectId: '',
    projectName: '',
    location: '',
    measurementDate: format(new Date(), 'yyyy-MM-dd'),
    recordedBy: '',
    width: '0"',
    height: '0"',
    area: '0 ft²',
    quantity: 1,
    direction: 'N/A',
    notes: '',
    status: 'Pending',
    createdAt: now,
    updatedAt: now,
    updatedBy: 'Current User'
  };
};

const MeasurementEntryModal: React.FC<MeasurementEntryModalProps> = ({
  isOpen,
  onOpenChange,
  measurement,
  onSave,
  mode
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState<Measurement>(
    measurement || generateNewMeasurement()
  );

  useEffect(() => {
    if (measurement) {
      setFormData(measurement);
    } else {
      setFormData(generateNewMeasurement());
    }
  }, [measurement, isOpen]);

  const handleSave = () => {
    // Update the timestamp 
    const updatedMeasurement = {
      ...formData,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedMeasurement);
    onOpenChange(false);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate area when width or height changes
  useEffect(() => {
    if (formData.width && formData.height) {
      const width = parseFloat(formData.width);
      const height = parseFloat(formData.height);
      
      if (!isNaN(width) && !isNaN(height)) {
        // Convert to square feet
        const area = (width * height) / 144;
        updateFormData('area', `${area.toFixed(2)} ft²`);
      }
    }
  }, [formData.width, formData.height]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-zinc-900 border border-zinc-800 text-white">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold flex justify-between items-center">
            <div>
              {mode === 'edit' ? 'Edit Measurement' : 'New Measurement'}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="w-8 h-8 p-0 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          {mode === 'edit' && (
            <DialogDescription className="text-zinc-400 text-sm">
              ID: {formData.id} | Project: {formData.projectName}
            </DialogDescription>
          )}
        </DialogHeader>

        <Tabs 
          defaultValue="details" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="border-b border-zinc-800 px-6">
            <TabsList className="bg-transparent h-auto p-0 space-x-6">
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-0 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
              >
                Measurement Details
              </TabsTrigger>
              <TabsTrigger 
                value="dimensions" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-0 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
              >
                Dimensions
              </TabsTrigger>
              <TabsTrigger 
                value="attributes" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-0 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
              >
                Attributes
              </TabsTrigger>
              <TabsTrigger 
                value="status" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-0 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
              >
                Status & Workflow
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="details" className="m-0">
              <MeasurementDetailsTab 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            </TabsContent>
            <TabsContent value="dimensions" className="m-0">
              <DimensionsTab 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            </TabsContent>
            <TabsContent value="attributes" className="m-0">
              <AttributesTab 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            </TabsContent>
            <TabsContent value="status" className="m-0">
              <StatusWorkflowTab 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-between items-center border-t border-zinc-800 p-6">
          <div className="text-xs text-zinc-500">
            Last updated: {format(new Date(formData.updatedAt), 'MMM dd, yyyy h:mm a')} by {formData.updatedBy}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white" 
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementEntryModal;
