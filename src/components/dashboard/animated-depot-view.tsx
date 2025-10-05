'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrainFront, ShieldCheck, Wrench, Sparkles, Hourglass } from 'lucide-react';
import type { Trainset, TrainStatus } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TRACKS = 6;
const TRACK_HEIGHT = 20;
const SPACING = 18;
const DEPOT_HEIGHT = (TRACK_HEIGHT + SPACING) * TRACKS;
const TRACK_WIDTH = 500;
const TRAIN_WIDTH = 60;

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

const Train = ({ train, trackIndex }: { train: Trainset; trackIndex: number }) => {
  const yPos = trackIndex * (TRACK_HEIGHT + SPACING) + TRACK_HEIGHT / 2;
  // Distribute trains along the track
  const xPos = (trackIndex % 2 === 0 ? 0.2 : 0.4) * TRACK_WIDTH;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.g
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: xPos, opacity: 1 }}
            transition={{ duration: 0.5, delay: trackIndex * 0.1 }}
            className="cursor-pointer"
          >
            <motion.g
              transform={`translate(${xPos}, ${yPos})`}
              whileHover={{ scale: 1.1 }}
            >
              <TrainFront
                className={`-translate-x-1/2 -translate-y-1/2 ${statusColors[train.status]}`}
                size={32}
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

interface AnimatedDepotViewProps {
  trains: Trainset[];
}

const AnimatedDepotView = ({ trains }: AnimatedDepotViewProps) => {
  // Simple logic to assign trains to tracks for visualization
  const getTrackForTrain = (trainId: string) => {
    const numId = parseInt(trainId.split('-')[1] || '0');
    return (numId - 1) % TRACKS;
  };
  
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

        {/* Tracks */}
        {Array.from({ length: TRACKS }).map((_, i) => (
          <g key={`track-group-${i}`}>
            <rect
              key={`track-bg-${i}`}
              x="0"
              y={i * (TRACK_HEIGHT + SPACING)}
              width="100%"
              height={TRACK_HEIGHT}
              fill="hsl(var(--muted) / 0.5)"
              rx="2"
            />
            <text x="5" y={i * (TRACK_HEIGHT + SPACING) + TRACK_HEIGHT / 2 + 4} fontSize="10" fill="hsl(var(--muted-foreground))">
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

        {/* Real Trains */}
        {trains.map((train) => {
          const trackIndex = getTrackForTrain(train.id);
          return <Train key={train.id} train={train} trackIndex={trackIndex} />;
        })}
      </svg>
    </div>
  );
};

export default AnimatedDepotView;
