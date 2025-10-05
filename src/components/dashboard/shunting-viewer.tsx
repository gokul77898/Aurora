'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Trainset } from '@/lib/types';
import AnimatedDepotView, { type Movement } from './animated-depot-view';

interface ShuntingViewerProps {
    trains: Trainset[];
    movements: Movement[];
    trainToInitialTrackMap: Map<string, number>;
}

export default function ShuntingViewer({ trains, movements, trainToInitialTrackMap }: ShuntingViewerProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Depot Status Viewer</CardTitle>
        <CardDescription>Live visual representation of depot layout</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video overflow-hidden rounded-lg border">
          <AnimatedDepotView trains={trains} movements={movements} trainToInitialTrackMap={trainToInitialTrackMap}/>
        </div>
      </CardContent>
    </Card>
  );
}
