
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TeamFilterTabsProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const TeamFilterTabs: React.FC<TeamFilterTabsProps> = ({ 
  defaultValue = "all-teams",
  onValueChange 
}) => {
  return (
    <div className="border-b border-zinc-800/70">
      <Tabs 
        defaultValue={defaultValue} 
        className="w-full"
        onValueChange={onValueChange}
      >
        <TabsList className="flex flex-wrap bg-transparent">
          <TabsTrigger 
            value="all-teams" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent"
          >
            All Teams
          </TabsTrigger>
          <TabsTrigger 
            value="residential" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent"
          >
            Residential
          </TabsTrigger>
          <TabsTrigger 
            value="commercial" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent"
          >
            Commercial
          </TabsTrigger>
          <TabsTrigger 
            value="specialty" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent"
          >
            Specialty
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TeamFilterTabs;
