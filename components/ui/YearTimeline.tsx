"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface YearTimelineProps {
  years: number[];
  activeYear: number | null;
  onYearClick: (year: number) => void;
}

/**
 * Interactive vertical year timeline with scroll indicator
 * Shows years as clickable dots with the active year highlighted
 */
export function YearTimeline({ years, activeYear, onYearClick }: YearTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  // Find active index for progress calculation
  const activeIndex = activeYear ? years.indexOf(activeYear) : 0;
  const progress = years.length > 1 ? activeIndex / (years.length - 1) : 0;

  // Smooth spring animation for the progress indicator
  const smoothProgress = useSpring(progress, { damping: 30, stiffness: 200 });

  useEffect(() => {
    smoothProgress.set(progress);
  }, [progress, smoothProgress]);

  if (years.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-1"
    >
      {/* Background track */}
      <div className="absolute inset-y-0 w-0.5 bg-border/30 rounded-full" />

      {/* Animated progress fill */}
      <motion.div
        className="absolute top-0 w-0.5 bg-gradient-to-b from-accent via-accent to-accent/50 rounded-full origin-top"
        style={{
          scaleY: smoothProgress,
          height: "100%"
        }}
      />

      {/* Year dots */}
      {years.map((year, index) => {
        const isActive = year === activeYear;
        const isHovered = year === hoveredYear;
        const isPast = activeYear ? year >= activeYear : index === 0;

        return (
          <motion.button
            key={year}
            onClick={() => onYearClick(year)}
            onMouseEnter={() => setHoveredYear(year)}
            onMouseLeave={() => setHoveredYear(null)}
            className="relative py-3 px-2 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Dot */}
            <motion.div
              className={`
                w-3 h-3 rounded-full border-2 transition-all duration-300
                ${isActive
                  ? "bg-accent border-accent shadow-lg shadow-accent/50"
                  : isPast
                    ? "bg-accent/80 border-accent/80"
                    : "bg-background border-border/50 group-hover:border-accent/50"
                }
              `}
              animate={{
                scale: isActive ? 1.3 : 1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />

            {/* Year label */}
            <AnimatePresence>
              {(isActive || isHovered) && (
                <motion.span
                  initial={{ opacity: 0, x: 10, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`
                    absolute right-full mr-3 top-1/2 -translate-y-1/2
                    px-2 py-1 text-sm font-semibold whitespace-nowrap
                    rounded-md backdrop-blur-sm
                    ${isActive
                      ? "bg-accent text-white"
                      : "bg-card/90 text-foreground border border-border/50"
                    }
                  `}
                >
                  {year}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Ripple effect on click */}
            {isActive && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              >
                <div className="w-3 h-3 rounded-full bg-accent/30" />
              </motion.div>
            )}
          </motion.button>
        );
      })}

      {/* Floating indicator showing current year at bottom */}
      <motion.div
        className="mt-4 px-3 py-1.5 bg-card/90 backdrop-blur-sm rounded-full border border-border/50 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs font-medium text-muted-foreground">
          {activeYear || years[0]}
        </span>
      </motion.div>
    </div>
  );
}

export default YearTimeline;
