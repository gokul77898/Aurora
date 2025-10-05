'use client';

import * as React from 'react';
import { AlertTriangle, Construction, Info } from 'lucide-react';
import { getMaintenancePrediction } from '@/lib/actions';
import type { Trainset } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Prediction {
  trainsetId: string;
  isMaintenanceLikely: boolean;
  reasoning: string;
  suggestedAction: string;
}

function PredictionCard({ prediction }: { prediction: Prediction }) {
  if (!prediction.isMaintenanceLikely) {
    return null;
  }

  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div className="mt-1.5">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <CardTitle>Trainset {prediction.trainsetId}</CardTitle>
          <CardDescription>Potential Maintenance Required</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="flex items-center font-semibold"><Info className="mr-2 h-4 w-4" />Reasoning</h4>
            <p className="text-sm text-muted-foreground">{prediction.reasoning}</p>
          </div>
          <div className="space-y-1">
            <h4 className="flex items-center font-semibold"><Construction className="mr-2 h-4 w-4" />Suggested Action</h4>
            <p className="text-sm text-muted-foreground">{prediction.suggestedAction}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PredictionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function PredictionsView({ trains }: { trains: Trainset[] }) {
  const [predictions, setPredictions] = React.useState<Prediction[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPredictions() {
      setLoading(true);
      const predictionPromises = trains.map((train) =>
        getMaintenancePrediction({
          trainsetId: train.id,
          mileage: train.mileage,
          fitnessStatus: train.fitnessStatus,
          slaPriority: train.slaPriority,
        })
      );
      const results = await Promise.all(predictionPromises);
      const validPredictions = results.filter((p): p is Prediction => p !== null);
      setPredictions(validPredictions);
      setLoading(false);
    }
    fetchPredictions();
  }, [trains]);

  const highRiskPredictions = predictions.filter(p => p.isMaintenanceLikely);

  return (
    <div className="mx-auto mt-4 grid max-w-screen-2xl gap-6">
      <div className="space-y-2">
         <h1 className="text-2xl font-semibold">Predictive Maintenance Alerts</h1>
         <p className="text-muted-foreground">
            AI-generated alerts for trainsets at high risk of requiring maintenance.
         </p>
      </div>

      {loading ? (
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => <PredictionSkeleton key={i} />)}
        </div>
      ) : highRiskPredictions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {highRiskPredictions.map((prediction) => (
            <PredictionCard key={prediction.trainsetId} prediction={prediction} />
          ))}
        </div>
      ) : (
        <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
                    <AlertTriangle className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">All Clear!</h3>
                <p className="mt-2 text-muted-foreground">
                    No high-risk maintenance predictions at this time. All trainsets are operating within normal parameters.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
