
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, UserCheck, FileText } from "lucide-react";

// Sample role data
const roles = [
  {
    name: "Team Lead",
    icon: "leader",
    memberCount: 3,
    description: "Oversees team operations, assigns tasks, and ensures project completion according to standards and timelines.",
    responsibilities: ["Project Assignment", "Team Management", "Quality Control", "Client Communication"]
  },
  {
    name: "Measurer",
    icon: "ruler",
    memberCount: 5,
    description: "Responsible for accurate window measurements, documenting specifications, and capturing necessary details for installation planning.",
    responsibilities: ["Measurement Taking", "Documentation", "Site Assessment"]
  },
  {
    name: "Installer",
    icon: "tools",
    memberCount: 7,
    description: "Executes window film installation according to measurements and specifications, ensuring proper application and finish.",
    responsibilities: ["Film Installation", "Surface Preparation", "Quality Inspection"]
  }
];

// Role icon component
const RoleIcon = ({ type }: { type: string }) => {
  const iconTypes = {
    "leader": <UserCheck className="h-5 w-5 text-white" />,
    "ruler": <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M19 4v16"></path><path d="M15 4v16"></path><path d="M11 4v16"></path><path d="M7 4v16"></path><path d="M3 4v16"></path></svg>,
    "tools": <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
  };
  
  const iconBackgrounds = {
    "leader": "bg-blue-700",
    "ruler": "bg-green-700", 
    "tools": "bg-slate-700"
  };

  return (
    <div className={`w-8 h-8 rounded-full ${iconBackgrounds[type] || "bg-gray-700"} flex items-center justify-center`}>
      {iconTypes[type] || <FileText className="h-5 w-5 text-white" />}
    </div>
  );
};

// Responsibility badge component
const ResponsibilityBadge = ({ name }: { name: string }) => (
  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded mr-2 mb-2">
    {name}
  </span>
);

const RoleDefinitionsPanel: React.FC = () => {
  return (
    <Card className="flex-1 border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Role Definitions</CardTitle>
        <Button size="sm" variant="outline" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add New Role
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {roles.map((role, index) => (
            <div key={index} className="pb-5 border-b last:border-0 last:pb-0">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <RoleIcon type={role.icon} />
                  <div>
                    <h3 className="font-semibold text-base">{role.name}</h3>
                    <span className="text-xs text-gray-500">{role.memberCount} members</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {role.description}
              </p>
              
              <div className="flex flex-wrap mt-2">
                {role.responsibilities.map((resp, i) => (
                  <ResponsibilityBadge key={i} name={resp} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleDefinitionsPanel;
