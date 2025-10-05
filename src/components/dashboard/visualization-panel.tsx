'use client';

import SlaCoverageChart from './sla-coverage-chart';
import MileageChart from './mileage-chart';
import type { Trainset } from '@/lib/types';
import ShuntingViewer from './shunting-viewer';
import type { Movement } from '@/ai/flows/suggest-shunting-movements';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Bot, Move } from 'lucide-react';

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
      
      {movements.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Shunting Plan
            </CardTitle>
            <CardDescription>
              The optimal sequence of movements for the current depot state.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <ol className="relative space-y-4 border-l-2 border-dashed border-primary/20 pl-6">
                {movements.map((move, index) => (
                  <li key={index} className="flex items-start gap-4">
                     <span className="absolute -left-3.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className='flex-grow'>
                      <p className="font-semibold text-sm">
                        Move {move.trainId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        From Track {move.fromTrack} to Track {move.toTrack}
                      </p>
                       <p className="mt-1 text-xs text-muted-foreground/80 italic">
                        &quot;{move.reason}&quot;
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
