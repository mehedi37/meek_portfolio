"use client";

import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollProgressProps {
  className?: string;
  showPercentage?: boolean;
  position?: "top" | "bottom";
  color?: string;
}

/**
 * Visual scroll progress indicator
 * Shows how far the user has scrolled through the page
 */
export function ScrollProgress({
  className = "",
  showPercentage = false,
  position = "top",
  color = "var(--color-accent)",
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`fixed left-0 right-0 h-1 z-50 origin-left ${
        position === "top" ? "top-0" : "bottom-0"
      } ${className}`}
      style={{
        scaleX,
        backgroundColor: color,
      }}
    />
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

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div className={`fixed bottom-8 right-8 z-50 ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-accent)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{
            pathLength,
            strokeDasharray: circumference,
            strokeDashoffset: 0,
          }}
        />
      </svg>
    </div>
  );
}

export default ScrollProgress;
