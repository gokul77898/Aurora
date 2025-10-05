'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ShuntingViewer() {
  const imageData = PlaceHolderImages.find(img => img.id === 'shunting-yard');

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Shunting Simulation Viewer</CardTitle>
        <CardDescription>Visual representation of depot layout</CardDescription>
      </CardHeader>
      <CardContent>
        {imageData ? (
          <div className="aspect-video overflow-hidden rounded-lg border">
            <Image
              src={imageData.imageUrl}
              alt={imageData.description}
              width={800}
              height={600}
              className="h-full w-full object-cover transition-transform hover:scale-105"
              data-ai-hint={imageData.imageHint}
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">Image not available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
