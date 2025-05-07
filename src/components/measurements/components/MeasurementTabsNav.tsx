
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MeasurementTabsNavProps {
  activeTab: string;
}

const MeasurementTabsNav: React.FC<MeasurementTabsNavProps> = ({ activeTab }) => {
  return (
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
          value="photos" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-0 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
        >
          Photos
        </TabsTrigger>
        <TabsTrigger 
          value="status" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-0 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
        >
          Status & Workflow
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default MeasurementTabsNav;
