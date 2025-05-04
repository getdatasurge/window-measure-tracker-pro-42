
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  team: string;
  avatar?: string;
  status: 'active' | 'on-leave' | 'training';
  email: string;
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

const TeamMemberList: React.FC<TeamMemberListProps> = ({ members }) => {
  return (
    <Card className="border-zinc-800/50 bg-zinc-900/50">
      <CardHeader className="border-b border-zinc-800/50">
        <CardTitle className="text-lg">Team Members</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800/50 hover:bg-zinc-800/30">
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Role</TableHead>
              <TableHead className="text-zinc-400">Team</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    {member.avatar ? (
                      <AvatarImage src={member.avatar} alt={member.name} />
                    ) : (
                      <AvatarFallback className="bg-zinc-700">
                        {member.name.split(' ').map(name => name[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span>{member.name}</span>
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                    {member.team}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                    <span>{getStatusLabel(member.status)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-400">{member.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TeamMemberList;
