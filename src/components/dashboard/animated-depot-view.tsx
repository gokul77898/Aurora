'use client';

import React from 'react';
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
  animate: {
    x: 550,
    transition: {
      duration: Math.random() * 5 + 8, // 8-13 seconds
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'linear',
    },
  },
   animateReverse: {
    x: -50,
    transition: {
      duration: Math.random() * 5 + 8,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'linear',
    },
  },
};

const AnimatedDepotView = () => {
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
        {Array.from({ length: 4 }).map((_, i) => {
          const trackIndex = Math.floor(i * 1.5) % TRACKS;
          const isReverse = i % 2 === 0;
          return (
            <motion.g
              key={`train-${i}`}
              custom={trackIndex}
              variants={trainVariants}
              initial="initial"
              animate={isReverse ? "animateReverse" : "animate"}
            >
              <TrainIcon />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};

export default AnimatedDepotView;
