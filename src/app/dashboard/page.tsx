'use client';

import { useMemo, useState } from 'react';
import type { Trainset } from '@/lib/types';
import DashboardHeader from '@/components/dashboard/header';
import TrainTable from '@/components/dashboard/train-table';
import VisualizationPanel from '@/components/dashboard/visualization-panel';
import ControlBar from '@/components/dashboard/control-bar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PredictionsView from '@/components/dashboard/predictions-view';
import { useCollection } from '@/firebase';
import { collection, doc, updateDoc, type Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { seedInitialData } from '@/lib/seed';
import type { Movement } from '@/ai/flows/suggest-shunting-movements';

export const maxDuration = 60; // Give the AI up to 60 seconds to respond

const TRACKS = 6;

export default function DashboardPage() {
  const firestore = useFirestore();
  const [movements, setMovements] = useState<Movement[]>([]);

  const trainsetsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'trainsets');
  }, [firestore]);

  const { data: trains, loading, error } = useCollection<Trainset>(trainsetsCollection);
  
  const trainToInitialTrackMap = useMemo(() => {
    const trackMap = new Map<string, number>();
    if (!trains) return trackMap;

    const usedTracks = new Set<number>();
    
    trains.forEach(train => {
      let track;
      const numId = parseInt(train.id.split('-')[1] || '0');
      const potentialTrack = (numId - 1) % TRACKS + 1;

      if (!usedTracks.has(potentialTrack)) {
        track = potentialTrack;
      } else {
        // Find the next available track if the preferred one is taken
        let nextTrack = 1;
        while(usedTracks.has(nextTrack) && nextTrack <= TRACKS) {
          nextTrack++;
        }
        track = nextTrack <= TRACKS ? nextTrack : (numId - 1) % TRACKS + 1; // fallback
      }
      usedTracks.add(track);
      trackMap.set(train.id, track);
    });
    return trackMap;
  }, [trains]);


  const handleTrainUpdate = async (updatedTrain: Partial<Trainset> & { id: string }) => {
    if (!firestore) return;
    const { id, ...data } = updatedTrain;
    const trainRef = doc(firestore, 'trainsets', id);
    await updateDoc(trainRef, data);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-muted/40">
        Loading train data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-muted/40">
        Error loading data: {error.message}
      </div>
    );
  }

  const handleSeed = async () => {
    if (firestore) {
      await seedInitialData(firestore);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-muted/40">
      <DashboardHeader />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {trains && trains.length === 0 && !loading && (
          <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
            <h2 className="text-xl font-semibold">No Train Data Found</h2>
            <p className="mt-2 text-muted-foreground">
              Your Firestore database is empty. You can seed it with the initial sample data.
            </p>
            <Button onClick={handleSeed} className="mt-4">
              Seed Initial Data
            </Button>
          </div>
        )}
        {trains && trains.length > 0 && (
          <Tabs defaultValue="overview">
            <div className="mx-auto max-w-screen-2xl">
              <TabsList className="grid w-full grid-cols-2 md:w-96">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview">
              <div className="mx-auto mt-4 grid max-w-screen-2xl auto-rows-max grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
                <div className="lg:col-span-2 xl:col-span-3">
                  <TrainTable trains={trains} onUpdateTrain={handleTrainUpdate} />
                </div>
                <div className="lg:col-span-1 xl:col-span-1">
                  <VisualizationPanel trains={trains} movements={movements} trainToInitialTrackMap={trainToInitialTrackMap} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="predictions">
              <PredictionsView trains={trains} />
            </TabsContent>
          </Tabs>
        )}
      </main>
      {trains && trains.length > 0 && <ControlBar trains={trains} onNewMovements={setMovements} trainToInitialTrackMap={trainToInitialTrackMap}/>}
    </div>
  );
}
