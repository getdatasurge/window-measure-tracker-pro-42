
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const roleData = {
  "Team Lead": {
    color: "blue",
    members: 3,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>
  },
  "Measurer": {
    color: "indigo",
    members: 5,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
  },
  "Installer": {
    color: "teal",
    members: 7,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
  },
  "Apprentice": {
    color: "purple",
    members: 3,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
  }
};

const teamData = {
  "Commercial": { members: 8, color: "green" },
  "Residential": { members: 7, color: "blue" },
  "Specialty": { members: 3, color: "purple" }
};

// Org chart node component
const OrgNode = ({ title, subtext, icon, bgColor = "bg-blue-600", size = "large" }: 
  { 
    title: string; 
    subtext?: string;
    icon?: React.ReactNode;
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
        {icon && <div className="mb-1">{icon}</div>}
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
        icon={roleData["Team Lead"].icon}
        bgColor="bg-blue-600" 
      />
      <div className="h-8 w-px bg-gray-300"></div>
      <div className="flex justify-center gap-12 pt-4">
        <div className="flex flex-col items-center">
          <OrgNode 
            title="Measurer" 
            subtext="5 members" 
            icon={roleData["Measurer"].icon}
            bgColor="bg-indigo-600" 
            size="medium"
          />
        </div>
        <div className="flex flex-col items-center">
          <OrgNode 
            title="Installer" 
            subtext="7 members" 
            icon={roleData["Installer"].icon}
            bgColor="bg-teal-600" 
            size="medium"
          />
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="pt-2">
            <OrgNode 
              title="Apprentice" 
              subtext="3 members" 
              icon={roleData["Apprentice"].icon}
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
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-gray-500">{value} members</span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-200">
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
  const totalMembers = Object.values(roleData).reduce((sum, role) => sum + role.members, 0);
  
  return (
    <Card className="flex-1 border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Team Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <OrgChart />
        
        <div className="mt-4">
          <h3 className="text-base font-medium mb-3">Team Distribution</h3>
          {Object.entries(teamData).map(([team, data]) => (
            <DistributionBar 
              key={team}
              label={team} 
              value={data.members}
              total={totalMembers}
              barColor={`bg-${data.color}-600`}
            />
          ))}
        </div>
        
        <div className="mt-6">
          <h3 className="text-base font-medium mb-3">Role Distribution</h3>
          {Object.entries(roleData).map(([role, data]) => (
            <DistributionBar 
              key={role}
              label={role} 
              value={data.members}
              total={totalMembers}
              barColor={`bg-${data.color}-600`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamStructurePanel;
