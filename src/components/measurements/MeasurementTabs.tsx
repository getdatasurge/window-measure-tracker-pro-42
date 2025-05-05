
import React, { useEffect, useState } from 'react';
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
  // Track the last field that was modified in each tab
  const [lastModifiedFields, setLastModifiedFields] = useState<{[key: string]: string}>({});
  
  // Define the last field for each tab
  const tabLastFields = {
    details: 'recordedBy',
    dimensions: 'area',
    attributes: 'notes',
    status: 'reviewComments'
  };
  
  // Enhanced updateFormData that tracks last field modified
  const enhancedUpdateFormData = (field: string, value: any) => {
    // Determine which tab this field belongs to
    let currentTab = '';
    if (['projectId', 'projectName', 'location', 'measurementDate', 'recordedBy'].includes(field)) {
      currentTab = 'details';
    } else if (['width', 'height', 'area', 'quantity'].includes(field)) {
      currentTab = 'dimensions';
    } else if (['direction', 'glassType', 'notes'].includes(field)) {
      currentTab = 'attributes';
    } else if (['status', 'reviewComments'].includes(field)) {
      currentTab = 'status';
    }
    
    if (currentTab) {
      setLastModifiedFields(prev => ({...prev, [currentTab]: field}));
    }
    
    updateFormData(field, value);
    
    // Auto-advance logic
    if (field === tabLastFields[currentTab]) {
      const isValidForAutoAdvance = isFieldValid(field, value);
      
      if (isValidForAutoAdvance) {
        // Determine next tab
        if (currentTab === 'details') {
          setTimeout(() => setActiveTab('dimensions'), 300);
        } else if (currentTab === 'dimensions') {
          setTimeout(() => setActiveTab('attributes'), 300);
        } else if (currentTab === 'attributes') {
          setTimeout(() => setActiveTab('status'), 300);
        }
      }
    }
  };
  
  // Simple validation function - expand as needed
  const isFieldValid = (field: string, value: any): boolean => {
    if (value === undefined || value === null || value === '') return false;
    
    if (field === 'width' || field === 'height') {
      return parseFloat(value) > 0;
    }
    
    if (field === 'quantity') {
      return parseInt(value) > 0;
    }
    
    return true;
  };

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
            updateFormData={enhancedUpdateFormData} 
          />
        </TabsContent>
        <TabsContent value="dimensions" className="m-0">
          <DimensionsTab 
            formData={formData} 
            updateFormData={enhancedUpdateFormData} 
          />
        </TabsContent>
        <TabsContent value="attributes" className="m-0">
          <AttributesTab 
            formData={formData} 
            updateFormData={enhancedUpdateFormData} 
          />
        </TabsContent>
        <TabsContent value="status" className="m-0">
          <StatusWorkflowTab 
            formData={formData} 
            updateFormData={enhancedUpdateFormData} 
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default MeasurementTabs;
