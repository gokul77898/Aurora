'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedDepotView from './animated-depot-view';

export default function ShuntingViewer() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Shunting Simulation Viewer</CardTitle>
        <CardDescription>Visual representation of depot layout</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video overflow-hidden rounded-lg border">
          <AnimatedDepotView />
        </div>
      </CardContent>
    </Card>
  );
}
