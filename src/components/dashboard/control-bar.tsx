'use client';

import * as React from 'react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
        <Button variant="outline" onClick={handleExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Export Plan
        </Button>
      </div>
    </footer>
  );
}
