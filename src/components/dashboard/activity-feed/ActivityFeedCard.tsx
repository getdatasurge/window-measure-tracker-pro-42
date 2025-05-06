
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TeamActivityFeed } from './index';

const ActivityFeedCard: React.FC = () => {
  return (
    <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Team Activity</h2>
        <TeamActivityFeed />
      </CardContent>
    </Card>
  );
};

export default ActivityFeedCard;
