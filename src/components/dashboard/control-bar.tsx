'use client';

import * as React from 'react';
import { FileDown, Bot, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getShuntingMovements } from '@/lib/actions';
import type { Trainset } from '@/lib/types';
import type { Movement } from '@/ai/flows/suggest-shunting-movements';

interface ControlBarProps {
  trains: Trainset[];
  onNewMovements: (movements: Movement[]) => void;
  trainToInitialTrackMap: Map<string, number>;
}

export default function ControlBar({ trains, onNewMovements, trainToInitialTrackMap }: ControlBarProps) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handleSuggestMovements = async () => {
    setLoading(true);
    toast({
      title: "Optimizing Shunting Plan",
      description: "The AI depot controller is analyzing the depot state...",
    });
    try {
      const trainStates = trains.map(train => ({
        id: train.id,
        track: trainToInitialTrackMap.get(train.id) || 1, // Use the passed map
        status: train.status,
        destination: train.status === 'maintenance' ? 'Maintenance Bay' : train.status === 'cleaning' ? 'Cleaning Bay' : 'Staging/Exit',
      }));

      const result = await getShuntingMovements({
        trains: trainStates,
        depotLayout: '6 parallel tracks. Track 1 is near the maintenance bay. Track 6 is near the cleaning bay. Other tracks are for staging.',
      });

      onNewMovements(result.movements);

      toast({
        title: "AI Plan Generated",
        description: "Simulation is running in the Depot Status Viewer.",
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: "The AI controller failed to generate a plan. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };


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
        <Button onClick={handleSuggestMovements} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Optimize Shunting
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Export Plan
        </Button>
      </div>
    </footer>
  );
}
