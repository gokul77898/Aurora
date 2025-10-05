'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedDepotView, { type Movement } from './animated-depot-view';
import type { Trainset } from '@/lib/types';

interface ShuntingViewerProps {
    trains: Trainset[];
    movements: Movement[];
}

export default function ShuntingViewer({ trains, movements }: ShuntingViewerProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Depot Status Viewer</CardTitle>
        <CardDescription>Live visual representation of depot layout</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video overflow-hidden rounded-lg border">
          <AnimatedDepotView trains={trains} movements={movements} />
        </div>
      </CardContent>
    </Card>
  );
}
