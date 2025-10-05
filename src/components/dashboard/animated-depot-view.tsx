'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrainFront, ShieldCheck, Wrench, Sparkles, Hourglass } from 'lucide-react';
import type { Trainset, TrainStatus } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TRACKS = 6;
const TRACK_HEIGHT = 30;
const SPACING = 20;
const DEPOT_HEIGHT = (TRACK_HEIGHT + SPACING) * TRACKS;
const TRACK_WIDTH = 600;

const statusIcons: Record<TrainStatus, React.ReactNode> = {
  service: <ShieldCheck className="h-4 w-4 text-green-400" />,
  standby: <Hourglass className="h-4 w-4 text-yellow-400" />,
  maintenance: <Wrench className="h-4 w-4 text-red-400" />,
  cleaning: <Sparkles className="h-4 w-4 text-blue-400" />,
};

const statusColors: Record<TrainStatus, string> = {
  service: 'text-green-300',
  standby: 'text-yellow-300',
  maintenance: 'text-red-300',
  cleaning: 'text-blue-300',
};

const getTrackY = (track: number) => (track - 1) * (TRACK_HEIGHT + SPACING) + TRACK_HEIGHT / 2;

const Train = ({ train, position }: { train: Trainset; position: { x: number; y: number } }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ x: position.x, y: position.y, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="cursor-pointer"
          >
            <motion.g whileHover={{ scale: 1.2 }}>
              <TrainFront
                className={`-translate-x-1/2 -translate-y-1/2 ${statusColors[train.status]}`}
                size={40}
              />
            </motion.g>
          </motion.g>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            {statusIcons[train.status]}
            <p>
              <strong>{train.id}</strong> ({train.status})
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export type Movement = { trainId: string; fromTrack: number; toTrack: number; reason: string };

interface AnimatedDepotViewProps {
  trains: Trainset[];
  movements: Movement[];
  trainToInitialTrackMap: Map<string, number>;
}

const AnimatedDepotView = ({ trains, movements, trainToInitialTrackMap }: AnimatedDepotViewProps) => {
  const [trainPositions, setTrainPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initialPositions = useMemo(() => {
    const positions: Record<string, { x: number, y: number }> = {};
    trains.forEach(train => {
      const track = trainToInitialTrackMap.get(train.id) || 1;
      positions[train.id] = {
        x: TRACK_WIDTH * 0.2,
        y: getTrackY(track),
      };
    });
    return positions;
  }, [trains, trainToInitialTrackMap]);
  
  useEffect(() => {
    // This effect should only run on the client
    if (!isClient) return;

    if (movements.length === 0) {
      setTrainPositions(initialPositions);
      return;
    }

    // Reset to initial positions before starting animation sequence
    setTrainPositions(initialPositions);
    
    let delay = 500; // Initial delay before the first animation starts
    const animationTimeout = 1500; // Delay between each movement

    movements.forEach((move, index) => {
      setTimeout(() => {
        setTrainPositions(prevPositions => {
          const { trainId, toTrack } = move;
          if (!prevPositions[trainId]) return prevPositions;

          const newY = getTrackY(toTrack);
          return {
            ...prevPositions,
            [trainId]: {
              ...prevPositions[trainId],
              y: newY,
            },
          };
        });
      }, delay + index * animationTimeout);
    });
  // The dependencies are correct. This effect should re-run ONLY when `movements` changes.
  // `initialPositions` is memoized and stable, `isClient` only changes once.
  }, [movements, isClient, initialPositions]);


  if (!isClient) {
    // Render a static placeholder on the server to prevent hydration mismatch and loops
    return (
      <div className="relative flex h-full w-full items-center justify-center bg-muted/20 p-4">
        <svg
          width="100%"
          height={DEPOT_HEIGHT}
          viewBox={`0 0 ${TRACK_WIDTH} ${DEPOT_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {Array.from({ length: TRACKS }).map((_, i) => (
            <g key={`track-group-${i}`}>
              <rect
                key={`track-bg-${i}`}
                x="0"
                y={i * (TRACK_HEIGHT + SPACING)}
                width="100%"
                height={TRACK_HEIGHT}
                fill="hsl(var(--muted) / 0.5)"
                rx="4"
              />
              <text x="10" y={i * (TRACK_HEIGHT + SPACING) + TRACK_HEIGHT / 2 + 5} fontSize="12" fill="hsl(var(--muted-foreground))">
                Track {i + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-muted/20 p-4">
      <svg
        width="100%"
        height={DEPOT_HEIGHT}
        viewBox={`0 0 ${TRACK_WIDTH} ${DEPOT_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern
            id="track-pattern"
            width="20"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <rect width="12" height="2" fill="hsl(var(--muted-foreground) / 0.5)" y="1" />
          </pattern>
        </defs>

        {Array.from({ length: TRACKS }).map((_, i) => (
          <g key={`track-group-${i}`}>
            <rect
              key={`track-bg-${i}`}
              x="0"
              y={i * (TRACK_HEIGHT + SPACING)}
              width="100%"
              height={TRACK_HEIGHT}
              fill="hsl(var(--muted) / 0.5)"
              rx="4"
            />
            <text x="10" y={i * (TRACK_HEIGHT + SPACING) + TRACK_HEIGHT / 2 + 5} fontSize="12" fill="hsl(var(--muted-foreground))">
              Track {i + 1}
            </text>
            <rect
              key={`track-ties-${i}`}
              x="0"
              y={i * (TRACK_HEIGHT + SPACING) + (TRACK_HEIGHT - 4) / 2}
              width="100%"
              height="4"
              fill="url(#track-pattern)"
            />
          </g>
        ))}
        
        <text x={TRACK_WIDTH - 80} y={getTrackY(1) - 5} fontSize="12" fill="hsl(var(--muted-foreground))" className="font-semibold">Maintenance</text>
        <text x={TRACK_WIDTH - 80} y={getTrackY(TRACKS) + 5} fontSize="12" fill="hsl(var(--muted-foreground))" className="font-semibold">Cleaning</text>

        <AnimatePresence>
          {trains.map((train) => {
            const position = trainPositions[train.id];
            // Only render the train if its position is calculated
            if (!position) return null;
            return <Train key={train.id} train={train} position={position} />;
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
};

export default AnimatedDepotView;
