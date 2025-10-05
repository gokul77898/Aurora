'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrainFront } from 'lucide-react';

const TRACKS = 6;
const TRACK_HEIGHT = 16;
const SPACING = 16;
const DEPOT_HEIGHT = (TRACK_HEIGHT + SPACING) * TRACKS;

const TrainIcon = () => (
  <motion.div
    className="absolute text-primary"
    style={{ top: -4, left: -12 }}
  >
    <TrainFront size={24} />
  </motion.div>
);

const trainVariants = {
  initial: (trackIndex: number) => ({
    x: -50,
    y: trackIndex * (TRACK_HEIGHT + SPACING) + TRACK_HEIGHT / 2,
  }),
  animate: (duration: number) => ({
    x: 550,
    transition: {
      duration,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'linear',
    },
  }),
  animateReverse: (duration: number) => ({
    x: -50,
    transition: {
      duration,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'linear',
    },
  }),
};

interface TrainAnimationProps {
  duration: number;
  trackIndex: number;
  isReverse: boolean;
}

const TrainAnimation = ({ duration, trackIndex, isReverse }: TrainAnimationProps) => (
  <motion.g
    custom={trackIndex}
    variants={trainVariants}
    initial="initial"
    animate={isReverse ? trainVariants.animateReverse(duration) : trainVariants.animate(duration)}
  >
    <TrainIcon />
  </motion.g>
);

const AnimatedDepotView = () => {
  const [durations, setDurations] = useState<number[]>([]);

  useEffect(() => {
    // Generate random durations only on the client-side to avoid hydration mismatch
    setDurations(Array.from({ length: 4 }, () => Math.random() * 5 + 8));
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-muted/20 p-4">
      <svg
        width="100%"
        height={DEPOT_HEIGHT}
        viewBox={`0 0 500 ${DEPOT_HEIGHT}`}
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
              width="500"
              height={TRACK_HEIGHT}
              fill="hsl(var(--muted) / 0.5)"
              rx="2"
            />
            <rect
              key={`track-ties-${i}`}
              x="0"
              y={i * (TRACK_HEIGHT + SPACING) + (TRACK_HEIGHT - 4) / 2}
              width="500"
              height="4"
              fill="url(#track-pattern)"
            />
          </g>
        ))}

        {/* Train Animations */}
        {durations.length > 0 && Array.from({ length: 4 }).map((_, i) => {
          const trackIndex = Math.floor(i * 1.5) % TRACKS;
          const isReverse = i % 2 === 0;
          return (
            <TrainAnimation
              key={`train-${i}`}
              duration={durations[i]}
              trackIndex={trackIndex}
              isReverse={isReverse}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default AnimatedDepotView;
