'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SlaCoverageChart from './sla-coverage-chart';
import MileageChart from './mileage-chart';
import ShuntingViewer from './shunting-viewer';
import type { Trainset } from '@/lib/types';
import type { Movement } from './animated-depot-view';

interface VisualizationPanelProps {
  trains: Trainset[];
  movements: Movement[];
}

export default function VisualizationPanel({ trains, movements }: VisualizationPanelProps) {
  return (
    <div className="space-y-6">
      <SlaCoverageChart trains={trains} />
      <MileageChart trains={trains} />
      <ShuntingViewer trains={trains} movements={movements} />
    </div>
  );
}
