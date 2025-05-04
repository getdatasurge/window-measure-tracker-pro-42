
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample team member data
const teamMembers = [
  {
    id: "TM-2025-001",
    name: "John Installer",
    avatar: "/lovable-uploads/e9f29315-c127-4c60-97d6-bc6eb6936a7a.png",
    team: "Commercial",
    role: "Team Lead",
    status: "Active",
    projects: 8,
    contact: {
      email: "john.i@example.com",
      phone: "(555) 123-4567"
    },
    lastActive: "Today, 9:41 AM"
  },
  {
    id: "TM-2025-018",
    name: "Sarah Johnson",
    avatar: "/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png",
    team: "Commercial",
    role: "Measurer",
    status: "Active",
    projects: 3,
    contact: {
      email: "sarah.j@example.com",
      phone: "(555) 234-5678"
    },
    lastActive: "Today, 11:23 AM"
  },
  {
    id: "TM-2025-003",
    name: "Michael Chen",
    avatar: "/lovable-uploads/211d8c12-4057-4c0f-80e4-5191abc30c81.png",
    team: "Commercial",
    role: "Installer",
    status: "Active",
    projects: 6,
    contact: {
      email: "michael.c@example.com",
      phone: "(555) 345-6789"
    },
    lastActive: "Today, 8:15 AM"
  },
  {
    id: "TM-2025-007",
    name: "Emily Davis",
    avatar: "/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png",
    team: "Residential",
    role: "Team Lead",
    status: "Active",
    projects: 9,
    contact: {
      email: "emily.d@example.com",
      phone: "(555) 456-7890"
    },
    lastActive: "Yesterday, 4:52 PM"
  },
  {
    id: "TM-2025-009",
    name: "Robert Wilson",
    avatar: "/lovable-uploads/e9f29315-c127-4c60-97d6-bc6eb6936a7a.png",
    team: "Specialty",
    role: "Team Lead",
    status: "On Leave",
    projects: 4,
    contact: {
      email: "robert.w@example.com",
      phone: "(555) 567-8901"
    },
    lastActive: "3 days ago"
  },
  {
    id: "TM-2025-012",
    name: "David Lopez",
    avatar: "/lovable-uploads/211d8c12-4057-4c0f-80e4-5191abc30c81.png",
    team: "Residential",
    role: "Installer",
    status: "Training",
    projects: 2,
    contact: {
      email: "david.l@example.com",
      phone: "(555) 678-9012"
    },
    lastActive: "Today, 10:37 AM"
  }
];

// Status badge component for consistent styling
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    "Active": "bg-green-100 text-green-800 hover:bg-green-200",
    "On Leave": "bg-amber-100 text-amber-800 hover:bg-amber-200",
    "Training": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "Inactive": "bg-gray-100 text-gray-800 hover:bg-gray-200"
  };

  return (
    <Badge className={statusStyles[status] || "bg-gray-100 text-gray-800"} variant="outline">
      {status}
    </Badge>
  );
};

// Team indicator component
const TeamIndicator = ({ team }: { team: string }) => {
  const teamColors = {
    "Commercial": "bg-green-500",
    "Residential": "bg-blue-500",
    "Specialty": "bg-purple-500"
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${teamColors[team] || "bg-gray-300"}`}></span>
      {team}
    </div>
  );
};

const TeamListPanel: React.FC = () => {
  return (
    <div className="border rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Projects</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-gray-500">ID: {member.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <TeamIndicator team={member.team} />
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <StatusBadge status={member.status} />
                </TableCell>
                <TableCell className="text-center">{member.projects}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{member.contact.email}</div>
                    <div className="text-gray-500">{member.contact.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{member.lastActive}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Assign Projects</DropdownMenuItem>
                        <DropdownMenuItem>Change Team</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="text-sm text-gray-600">
          Showing 1 to 6 of 18 results
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled>
            <span className="sr-only">Previous page</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Button>
          <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
            1
          </Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <span className="px-2">...</span>
          <Button variant="outline" size="icon">
            <span className="sr-only">Next page</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamListPanel;
