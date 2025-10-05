'use client';

import * as React from 'react';
import { BrainCircuit, FileDown, Loader2, Bot, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOptimizedPaths, getSuggestedMoves } from '@/lib/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { Trainset } from '@/lib/types';
import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import AnimatedDepotView from './animated-depot-view';

type Movement = { trainId: string; fromTrack: number; toTrack: number; reason: string };

type ShuntingMovesResult = {
  movements?: Movement[];
  summary?: string;
  error?: string;
};


function SuggestMovesDialog({trains, onAnimate}: {trains: Trainset[], onAnimate: (moves: Movement[]) => void}) {
  const [isOpen, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<ShuntingMovesResult | null>(null);

  const handleSuggestMoves = async () => {
    if (!trains) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Train data is not available to generate suggestions.',
      });
      return;
    }
    setLoading(true);
    setResult(null);

    const getTrackForTrain = (trainId: string) => {
      const numId = parseInt(trainId.split('-')[1] || '0');
      return (numId - 1) % 6 + 1;
    };

    const trainStates = trains.map((t) => ({
      id: t.id,
      track: getTrackForTrain(t.id),
      status: t.status,
      destination: t.status === 'maintenance' ? 'Maintenance Bay' : t.status === 'cleaning' ? 'Cleaning Bay' : 'Staging/Exit',
    }));

    const res = await getSuggestedMoves({
      trains: trainStates,
      depotLayout: '6 main tracks, with a maintenance bay at track 1 and a cleaning bay at track 6. All tracks can access the exit line.',
    });
    setResult(res);
    setLoading(false);
  };
  
  const handlePlaySimulation = () => {
    if (result && result.movements) {
      onAnimate(result.movements);
    }
  }

  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <Bot className="mr-2 h-4 w-4" />
        Suggest Shunting Movements
      </Button>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI-Suggested Shunting Movements</DialogTitle>
          <DialogDescription>
            The AI depot controller has analyzed the current depot state and suggests the following actions.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-80 gap-4 text-center">
              <Bot className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground">Click "Generate Suggestions" to get started.</p>
              <Button onClick={handleSuggestMoves}>Generate Suggestions</Button>
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : result ? (
            <ScrollArea className="h-96 pr-6">
              {result.error ? (
                <div className="text-destructive flex items-center justify-center h-80">{result.error}</div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Plan Summary</h3>
                    <p className="text-sm text-muted-foreground">{result.summary}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Step-by-Step Movements</h3>
                    <div className="space-y-4">
                      {result.movements?.map((move, index) => (
                        <div key={index} className="flex gap-4 items-start p-3 rounded-lg bg-muted/50">
                          <div className="flex-shrink-0 bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm">{index + 1}</div>
                          <div className="flex-grow">
                            <p className="font-semibold">Move Train {move.trainId} from Track {move.fromTrack} to Track {move.toTrack}</p>
                            <p className="text-sm text-muted-foreground">{move.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          ) : null}
        </div>
        <DialogFooter>
           {result && result.movements && (
            <Button variant="outline" onClick={handlePlaySimulation}>
              <Play className="mr-2 h-4 w-4" />
              Play Simulation
            </Button>
          )}
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          <Button onClick={handleSuggestMoves} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {result ? 'Re-generate Suggestions' : 'Generate Suggestions'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function OptimizePathsDialog() {
  const [isOpen, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ optimizedPaths?: string; performanceMetrics?: string; error?: string } | null>(null);

  const handleOptimize = async () => {
    setLoading(true);
    setResult(null);
    const res = await getOptimizedPaths({
      depotLayout: 'Standard 12-track depot with cross-over switches.',
      trainsetCharacteristics: '8-car electric multiple units (EMUs).',
      inductionSchedule: 'Staggered arrivals every 15 minutes during off-peak hours.',
      optimizationGoals: 'Minimize shunting time and reduce track conflicts.',
    });
    setResult(res);
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <Button onClick={() => { setOpen(true); handleOptimize(); }}>
        <BrainCircuit className="mr-2 h-4 w-4" />
        Optimize Shunting Paths
      </Button>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Shunting Path Optimization (Legacy)</DialogTitle>
          <DialogDescription>
            AI-powered genetic algorithm to find optimal shunting paths and patterns.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : result ? (
            <ScrollArea className="h-80 pr-6">
              {result.error ? (
                <div className="text-destructive">{result.error}</div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Optimized Paths</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.optimizedPaths}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Performance Metrics</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.performanceMetrics}</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          <Button onClick={handleOptimize} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Re-run Optimization
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function ControlBar({ onAnimate, trains }: { onAnimate: (moves: Movement[]) => void, trains: Trainset[] }) {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Exporting Plan",
      description: "Your induction plan is being generated and will be downloaded shortly.",
    });
    // Placeholder for actual export logic
  };

  return (
    <footer className="sticky bottom-0 z-30 mt-auto border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-end gap-4 px-4 md:px-6">
        <SuggestMovesDialog trains={trains} onAnimate={onAnimate} />
        <OptimizePathsDialog />
        <Button variant="outline" onClick={handleExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Export Plan
        </Button>
      </div>
    </footer>
  );
}
