
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  team: string;
  avatar?: string;
  status: 'active' | 'on-leave' | 'training';
  projects: number;
  email: string;
  phone: string;
  lastActive: string;
}

interface TeamMemberListProps {
  members: TeamMember[];
}

const getStatusColor = (status: TeamMember['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'on-leave':
      return 'bg-amber-500';
    case 'training':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusLabel = (status: TeamMember['status']): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'on-leave':
      return 'On Leave';
    case 'training':
      return 'Training';
    default:
      return 'Unknown';
  }
};

const getTeamColor = (team: string): string => {
  switch (team.toLowerCase()) {
    case 'commercial':
      return 'bg-blue-500';
    case 'residential':
      return 'bg-green-500';
    case 'specialty':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const TeamMemberList: React.FC<TeamMemberListProps> = ({ members }) => {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700/50 hover:bg-zinc-800/30">
            <TableHead className="text-zinc-400 font-medium">Name</TableHead>
            <TableHead className="text-zinc-400 font-medium">Team</TableHead>
            <TableHead className="text-zinc-400 font-medium">Role</TableHead>
            <TableHead className="text-zinc-400 font-medium">Status</TableHead>
            <TableHead className="text-zinc-400 font-medium">Projects</TableHead>
            <TableHead className="text-zinc-400 font-medium">Contact</TableHead>
            <TableHead className="text-zinc-400 font-medium">Last Active</TableHead>
            <TableHead className="text-zinc-400 font-medium w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="border-zinc-700/50 hover:bg-zinc-800/30">
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {member.avatar ? (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  ) : (
                    <AvatarFallback className="bg-zinc-700 text-zinc-200">
                      {member.name.split(' ').map(name => name[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-zinc-200">{member.name}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getTeamColor(member.team)}`}></div>
                  <span className="text-zinc-300">{member.team}</span>
                </div>
              </TableCell>
              <TableCell className="text-zinc-300">{member.role}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={`${
                    member.status === 'active' 
                      ? 'border-green-800 bg-green-900/20 text-green-400' 
                      : member.status === 'on-leave'
                      ? 'border-amber-800 bg-amber-900/20 text-amber-400'
                      : 'border-blue-800 bg-blue-900/20 text-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(member.status)}`}></div>
                    {getStatusLabel(member.status)}
                  </div>
                </Badge>
              </TableCell>
              <TableCell className="text-zinc-300">{member.projects}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-zinc-300 text-sm">{member.email}</span>
                  <span className="text-zinc-500 text-xs">{member.phone}</span>
                </div>
              </TableCell>
              <TableCell className="text-zinc-400">{member.lastActive}</TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                      <DropdownMenuItem className="cursor-pointer hover:bg-zinc-700">Edit</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-zinc-700">View Details</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-zinc-700 text-red-400">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-700/50">
        <p className="text-sm text-zinc-400">Showing 1 to 6 of 18 results</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-zinc-800/70 border-zinc-700 text-zinc-400">
            &lt;
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-zinc-800/70 border-zinc-700 text-zinc-400" disabled>
            1
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-zinc-800/70 border-zinc-700 text-zinc-400">
            2
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-zinc-800/70 border-zinc-700 text-zinc-400">
            3
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-zinc-800/70 border-zinc-700 text-zinc-400">
            &gt;
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberList;
