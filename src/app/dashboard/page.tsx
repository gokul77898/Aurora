'use client';

import { useState } from 'react';
import { initialTrainData } from '@/lib/data';
import type { Trainset } from '@/lib/types';
import DashboardHeader from '@/components/dashboard/header';
import TrainTable from '@/components/dashboard/train-table';
import VisualizationPanel from '@/components/dashboard/visualization-panel';
import ControlBar from '@/components/dashboard/control-bar';

export default function DashboardPage() {
  const [trains, setTrains] = useState<Trainset[]>(initialTrainData);

  const handleTrainUpdate = (updatedTrain: Trainset) => {
    setTrains((currentTrains) =>
      currentTrains.map((t) => (t.id === updatedTrain.id ? updatedTrain : t))
    );
  };
  
  return (
    <div className="flex h-screen w-full flex-col bg-muted/40">
      <DashboardHeader />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto grid max-w-screen-2xl auto-rows-max grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
          <div className="lg:col-span-2 xl:col-span-3">
            <TrainTable trains={trains} onUpdateTrain={handleTrainUpdate} />
          </div>
          <div className="lg:col-span-1 xl:col-span-1">
            <VisualizationPanel trains={trains} />
          </div>
        </div>
      </main>
      <ControlBar />
    </div>
  );
}
