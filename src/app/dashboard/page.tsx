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
import type { Movement } from '@/components/dashboard/animated-depot-view';

export const maxDuration = 60; // Give the AI up to 60 seconds to respond

export default function DashboardPage() {
  const firestore = useFirestore();
  const [movements, setMovements] = useState<Movement[]>([]);

  const trainsetsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'trainsets');
  }, [firestore]);

  const { data: trains, loading, error } = useCollection<Trainset>(trainsetsCollection);

  const handleTrainUpdate = async (updatedTrain: Partial<Trainset> & { id: string }) => {
    if (!firestore) return;
    const { id, ...data } = updatedTrain;
    const trainRef = doc(firestore, 'trainsets', id);
    await updateDoc(trainRef, data);
  };

  const handleAnimate = (moves: Movement[]) => {
    setMovements(moves);
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
                  <VisualizationPanel trains={trains} movements={movements} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="predictions">
              <PredictionsView trains={trains} />
            </TabsContent>
          </Tabs>
        )}
      </main>
      {trains && trains.length > 0 && <ControlBar onAnimate={handleAnimate} trains={trains} />}
    </div>
  );
}
