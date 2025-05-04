
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PromptHistoryViewer from '@/components/prompt-history';

const LogHistoryCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Log History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg bg-white">
          <PromptHistoryViewer variant="inline" />
        </div>
      </CardContent>
    </Card>
  );
};

export default LogHistoryCard;
