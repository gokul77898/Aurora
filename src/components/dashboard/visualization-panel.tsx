'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SlaCoverageChart from './sla-coverage-chart';
import MileageChart from './mileage-chart';
import ShuntingViewer from './shunting-viewer';
import type { Trainset } from '@/lib/types';

interface VisualizationPanelProps {
  trains: Trainset[];
}

export default function VisualizationPanel({ trains }: VisualizationPanelProps) {
  return (
    <div className="space-y-6">
      <SlaCoverageChart trains={trains} />
      <MileageChart trains={trains} />
      <ShuntingViewer trains={trains} />
    </div>
  );
}
