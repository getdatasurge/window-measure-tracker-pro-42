
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface TeamDistributionChartProps {
  title: string;
  data: ChartData[];
}

const TeamDistributionChart: React.FC<TeamDistributionChartProps> = ({ title, data }) => {
  const chartConfig = data.reduce((acc, item) => {
    acc[item.name] = {
      color: item.color
    };
    return acc;
  }, {} as Record<string, { color: string }>);

  return (
    <Card className="border-zinc-800/70 bg-zinc-900/50 p-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-64">
          <ChartContainer config={chartConfig}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    labelFormatter={(value) => `${value}`} 
                  />
                }
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamDistributionChart;
