'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Trainset } from '@/lib/types';

interface MileageChartProps {
  trains: Trainset[];
}

export default function MileageChart({ trains }: MileageChartProps) {
  const chartData = trains
    .filter(train => train.status !== 'maintenance')
    .sort((a, b) => b.mileage - a.mileage)
    .slice(0, 5);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Mileage Balance</CardTitle>
        <CardDescription>Top 5 non-maintenance trainsets by mileage</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
          mileage: {
            label: "Mileage",
            color: "hsl(var(--chart-1))",
          },
        }}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="id"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
             <YAxis
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="mileage" fill="var(--color-mileage)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
