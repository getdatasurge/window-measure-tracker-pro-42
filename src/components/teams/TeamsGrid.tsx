
import React from 'react';
import TeamRoleCard from './TeamRoleCard';

interface TeamRole {
  id: string;
  title: string;
  count: number;
  description: string;
  color: string;
}

interface TeamsGridProps {
  roles: TeamRole[];
}

const TeamsGrid: React.FC<TeamsGridProps> = ({ roles }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {roles.map((role) => (
        <TeamRoleCard
          key={role.id}
          title={role.title}
          count={role.count}
          description={role.description}
          color={role.color}
        />
      ))}
    </div>
  );
};

export default TeamsGrid;
