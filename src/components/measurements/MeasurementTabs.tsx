
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MeasurementDetailsTab from './tabs/MeasurementDetailsTab';
import DimensionsTab from './tabs/DimensionsTab';
import AttributesTab from './tabs/AttributesTab';
import StatusWorkflowTab from './tabs/StatusWorkflowTab';
import { Measurement } from '@/data/measurementsData';

interface MeasurementTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: Measurement;
  updateFormData: (field: string, value: any) => void;
}

const MeasurementTabs: React.FC<MeasurementTabsProps> = ({
  activeTab,
  setActiveTab,
  formData,
  updateFormData
}) => {
  return (
    <Tabs 
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
  );
};

export default MeasurementTabs;
