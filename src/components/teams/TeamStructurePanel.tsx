import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { teamDistributionData, roleDistributionData } from '@/types/team';

// Org chart node component
const OrgNode = ({ title, subtext, bgColor = "bg-blue-600", size = "large" }: 
  { 
    title: string; 
    subtext?: string;
    bgColor?: string;
    size?: "large" | "medium" | "small";
  }) => {
  const sizeClasses = {
    large: "w-24 h-24 text-base",
    medium: "w-20 h-20 text-sm",
    small: "w-16 h-16 text-xs"
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-full ${bgColor} text-white flex flex-col items-center justify-center relative`}>
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col">
        <div className="font-medium">{title}</div>
        {subtext && <div className="text-xs opacity-80">{subtext}</div>}
      </div>
    </div>
  );
};

// Org chart component
const OrgChart = () => {
  return (
    <div className="flex flex-col items-center pt-4 pb-8">
      <OrgNode 
        title="Team Lead" 
        subtext="3 members" 
        bgColor="bg-blue-600" 
      />
      <div className="h-8 w-px bg-zinc-700"></div>
      <div className="flex justify-center gap-12 pt-4">
        <div className="flex flex-col items-center">
          <OrgNode 
            title="Measurer" 
            subtext="5 members" 
            bgColor="bg-indigo-600" 
            size="medium"
          />
        </div>
        <div className="flex flex-col items-center">
          <OrgNode 
            title="Installer" 
            subtext="7 members" 
            bgColor="bg-teal-600" 
            size="medium"
          />
          <div className="h-6 w-px bg-zinc-700"></div>
          <div className="pt-2">
            <OrgNode 
              title="Apprentice" 
              subtext="3 members" 
              bgColor="bg-purple-600" 
              size="small"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Distribution bar component
const DistributionBar = ({ 
  label, 
  value, 
  total, 
  barColor = "bg-blue-600" 
}: { 
  label: string; 
  value: number; 
  total: number;
  barColor?: string;
}) => {
  const percentage = Math.round((value / total) * 100);
  
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-zinc-300">{label}</span>
        <span className="text-sm text-zinc-400">{value} members</span>
      </div>
      <div className="h-2.5 rounded-full bg-zinc-800">
        <div 
          className={`h-2.5 rounded-full ${barColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const TeamStructurePanel: React.FC = () => {
  // Calculate total members
  const totalMembers = roleDistributionData.reduce((sum, role) => sum + role.value, 0);
  
  return (
    <Card className="flex-1 border-zinc-800/50 bg-zinc-900/50">
      <CardHeader className="pb-2 border-b border-zinc-800/50">
        <CardTitle className="text-xl font-semibold text-white">Team Structure</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <OrgChart />
        
        <div className="mt-6">
          <h3 className="text-base font-medium mb-3 text-white">Team Distribution</h3>
          {teamDistributionData.map((team) => (
            <DistributionBar 
              key={team.name}
              label={team.name} 
              value={team.value}
              total={totalMembers}
              barColor={team.color}
            />
          ))}
        </div>
        
        <div className="mt-6">
          <h3 className="text-base font-medium mb-3 text-white">Role Distribution</h3>
          {roleDistributionData.map((role) => (
            <DistributionBar 
              key={role.name}
              label={role.name} 
              value={role.value}
              total={totalMembers}
              barColor={role.color}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamStructurePanel;
