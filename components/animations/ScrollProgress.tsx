"use client";

import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollProgressProps {
  className?: string;
  position?: "top" | "bottom";
}

/**
 * ORBITAL Scroll Progress
 * Gradient progress bar with glow effect
 */
export function ScrollProgress({
  className = "",
  position = "top",
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      className={`fixed left-0 right-0 h-1 z-50 ${
        position === "top" ? "top-0" : "bottom-0"
      } ${className}`}
    >
      {/* Background track */}
      <div className="absolute inset-0 bg-border/20" />

      {/* Progress bar */}
      <motion.div
        className="absolute inset-0 origin-left bg-gradient-to-r from-accent via-primary to-success"
        style={{ scaleX }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 origin-left bg-gradient-to-r from-accent via-primary to-success blur-sm opacity-50"
        style={{ scaleX }}
      />
    </div>
  );
}

/**
 * Circular scroll progress indicator
 */
export function CircularScrollProgress({
  className = "",
  size = 60,
  strokeWidth = 4,
}: {
  className?: string;
  size?: number;
  strokeWidth?: number;
}) {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={`fixed bottom-8 right-8 z-50 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border/20"
        />

        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ pathLength }}
          strokeDasharray={circumference}
          className="text-accent"
          strokeDashoffset={0}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--gradient-start)" />
            <stop offset="50%" stopColor="var(--gradient-mid)" />
            <stop offset="100%" stopColor="var(--gradient-end)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default ScrollProgress;
