'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart, Sector } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Trainset } from '@/lib/types';

interface SlaCoverageChartProps {
  trains: Trainset[];
}

export default function SlaCoverageChart({ trains }: SlaCoverageChartProps) {
  const totalTrains = trains.length;
  const serviceTrains = trains.filter((t) => t.status === 'service').length;
  const coverage = totalTrains > 0 ? (serviceTrains / totalTrains) * 100 : 0;

  const chartData = [
    { name: 'Service', value: coverage, fill: 'hsl(var(--chart-1))' },
    { name: 'Other', value: 100 - coverage, fill: 'hsl(var(--muted))' },
  ];

  const activeIndex = 0;

  return (
    <Card className="flex flex-col shadow-lg">
      <CardHeader className="items-center pb-0">
        <CardTitle>SLA Coverage Meter</CardTitle>
        <CardDescription>In-Service vs. Total Trainsets</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 10}
                    innerRadius={outerRadius + 4}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox) {
                    const { cx, cy } = viewBox;
                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={cx}
                          y={cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {coverage.toFixed(1)}%
                        </tspan>
                        <tspan
                          x={cx}
                          y={cy + 20}
                          className="fill-muted-foreground text-sm"
                        >
                          Coverage
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" /> Meeting SLA targets
        </div>
        <div className="leading-none text-muted-foreground">
          {serviceTrains} of {totalTrains} trains are in service.
        </div>
      </CardFooter>
    </Card>
  );
}
