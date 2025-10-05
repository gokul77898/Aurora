'use client';

import SlaCoverageChart from './sla-coverage-chart';
import MileageChart from './mileage-chart';
import type { Trainset } from '@/lib/types';
import ShuntingViewer from './shunting-viewer';

interface VisualizationPanelProps {
  trains: Trainset[];
}

export default function VisualizationPanel({ trains }: VisualizationPanelProps) {
  return (
    <div className="space-y-6">
      <SlaCoverageChart trains={trains} />
      <MileageChart trains={trains} />
      <ShuntingViewer trains={trains} movements={[]} />
    </div>
  );
}
