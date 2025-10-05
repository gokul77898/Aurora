'use client';

import * as React from 'react';
import { BrainCircuit, FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOptimizedPaths } from '@/lib/actions';
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
          <DialogTitle>Shunting Path Optimization</DialogTitle>
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


export default function ControlBar() {
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
        <OptimizePathsDialog />
        <Button variant="outline" onClick={handleExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Export Plan
        </Button>
      </div>
    </footer>
  );
}
