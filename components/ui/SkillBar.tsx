"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface SkillBarProps {
  name: string;
  level: number; // 0-100
  icon?: ReactNode;
  showPercentage?: boolean;
}

/**
 * Professional animated skill progress bar
 * Clean design with gradient fill
 */
export function SkillBar({
  name,
  level,
  icon,
  showPercentage = true,
}: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-accent/80">
              {icon}
            </span>
          )}
          <span className="text-sm font-medium text-foreground">{name}</span>
        </div>
        {showPercentage && (
          <motion.span
            className="text-xs font-medium text-muted-foreground tabular-nums"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            {level}%
          </motion.span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{
            duration: 1,
            delay: 0.2,
            ease: [0.25, 0.4, 0.25, 1],
          }}
        />
      </div>
    </div>
  );
}

/**
 * Circular skill indicator
 * Alternative representation for skill level
 */
export function SkillCircle({
  name,
  level,
  icon,
  size = 80,
}: SkillBarProps & { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const circumference = 2 * Math.PI * 36; // radius = 36
  const strokeDashoffset = circumference - (level / 100) * circumference;

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox="0 0 80 80"
        >
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="url(#skillGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={
              isInView
                ? { strokeDashoffset }
                : { strokeDashoffset: circumference }
            }
            transition={{
              duration: 1.5,
              delay: 0.2,
              ease: [0.25, 0.4, 0.25, 1],
            }}
          />
          <defs>
            <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-accent)" />
              <stop offset="100%" stopColor="var(--color-primary)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon ? (
            <span className="text-accent">{icon}</span>
          ) : (
            <span className="text-lg font-bold text-foreground">{level}%</span>
          )}
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground text-center">
        {name}
      </span>
    </div>
  );
}

export default SkillBar;
