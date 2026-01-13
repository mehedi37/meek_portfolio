"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks";

interface AbstractHeroProps {
  className?: string;
  variant?: "gradient" | "geometric" | "minimal";
}

/**
 * Professional abstract hero animation component
 * Replaces cartoon character with elegant geometric shapes and gradients
 */
export function AbstractHero({ className = "", variant = "geometric" }: AbstractHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll();
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Subtle transforms based on scroll
  const rotate1 = useTransform(smoothProgress, [0, 1], [0, 180]);
  const rotate2 = useTransform(smoothProgress, [0, 1], [0, -90]);
  const scale1 = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.1, 1]);
  const y1 = useTransform(smoothProgress, [0, 1], [0, -30]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, 20]);

  if (prefersReducedMotion) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <StaticAbstract />
      </div>
    );
  }

  if (variant === "minimal") {
    return <MinimalAnimation className={className} />;
  }

  if (variant === "gradient") {
    return <GradientAnimation className={className} />;
  }

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {/* Main geometric composition */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{ maxWidth: 400, maxHeight: 400 }}
      >
        <defs>
          {/* Primary gradient */}
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-primary)" />
          </linearGradient>

          {/* Secondary gradient */}
          <linearGradient id="secondaryGradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.3" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Shadow filter */}
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Background circle - large */}
        <motion.circle
          cx="200"
          cy="200"
          r="150"
          fill="url(#secondaryGradient)"
          style={{ scale: scale1 }}
          filter="url(#softGlow)"
        />

        {/* Rotating hexagon */}
        <motion.g style={{ rotate: rotate1, originX: "200px", originY: "200px" }}>
          <polygon
            points="200,80 280,140 280,260 200,320 120,260 120,140"
            fill="none"
            stroke="url(#primaryGradient)"
            strokeWidth="2"
            opacity="0.6"
          />
        </motion.g>

        {/* Central code/tech symbol */}
        <motion.g style={{ y: y1 }} filter="url(#dropShadow)">
          {/* Terminal window shape */}
          <rect
            x="140"
            y="150"
            width="120"
            height="100"
            rx="8"
            fill="var(--card)"
            stroke="var(--border)"
            strokeWidth="1"
          />
          {/* Terminal header dots */}
          <circle cx="155" cy="165" r="4" fill="#EF4444" />
          <circle cx="170" cy="165" r="4" fill="#F59E0B" />
          <circle cx="185" cy="165" r="4" fill="#22C55E" />

          {/* Code lines */}
          <rect x="150" y="185" width="40" height="4" rx="2" fill="var(--color-accent)" opacity="0.8" />
          <rect x="150" y="195" width="70" height="4" rx="2" fill="var(--muted-foreground)" opacity="0.5" />
          <rect x="150" y="205" width="55" height="4" rx="2" fill="var(--color-primary)" opacity="0.6" />
          <rect x="150" y="215" width="80" height="4" rx="2" fill="var(--muted-foreground)" opacity="0.4" />
          <rect x="150" y="225" width="35" height="4" rx="2" fill="var(--color-accent)" opacity="0.7" />
        </motion.g>

        {/* Orbiting elements */}
        <motion.g style={{ rotate: rotate2, originX: "200px", originY: "200px" }}>
          {/* Small orbiting circles */}
          <circle cx="320" cy="200" r="12" fill="var(--color-accent)" opacity="0.8" />
          <circle cx="80" cy="200" r="8" fill="var(--color-primary)" opacity="0.6" />
          <circle cx="200" cy="80" r="10" fill="var(--color-accent)" opacity="0.5" />
        </motion.g>

        {/* Floating tech icons */}
        <motion.g style={{ y: y2 }}>
          {/* React-like symbol */}
          <ellipse
            cx="320"
            cy="120"
            rx="25"
            ry="10"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <ellipse
            cx="320"
            cy="120"
            rx="25"
            ry="10"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            opacity="0.5"
            transform="rotate(60, 320, 120)"
          />
          <ellipse
            cx="320"
            cy="120"
            rx="25"
            ry="10"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            opacity="0.5"
            transform="rotate(-60, 320, 120)"
          />
          <circle cx="320" cy="120" r="5" fill="var(--color-accent)" opacity="0.8" />
        </motion.g>

        {/* Database/stack symbol */}
        <motion.g style={{ y: y1 }}>
          <ellipse cx="80" cy="280" rx="20" ry="8" fill="var(--color-primary)" opacity="0.4" />
          <ellipse cx="80" cy="290" rx="20" ry="8" fill="var(--color-primary)" opacity="0.5" />
          <ellipse cx="80" cy="300" rx="20" ry="8" fill="var(--color-primary)" opacity="0.6" />
        </motion.g>
      </svg>
    </div>
  );
}

function StaticAbstract() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full opacity-80">
      <defs>
        <linearGradient id="staticGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-primary)" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="120" fill="url(#staticGradient)" opacity="0.2" />
      <rect x="150" y="160" width="100" height="80" rx="8" fill="var(--card)" stroke="var(--border)" />
      <rect x="160" y="180" width="60" height="4" rx="2" fill="var(--color-accent)" opacity="0.6" />
      <rect x="160" y="190" width="40" height="4" rx="2" fill="var(--muted-foreground)" opacity="0.4" />
      <rect x="160" y="200" width="70" height="4" rx="2" fill="var(--color-primary)" opacity="0.5" />
    </svg>
  );
}

function MinimalAnimation({ className }: { className: string }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-accent/20 to-primary/10 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="relative w-32 h-32 rounded-2xl bg-card border border-border shadow-lg flex items-center justify-center"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent to-primary">
          {"</>"}
        </span>
      </motion.div>
    </div>
  );
}

function GradientAnimation({ className }: { className: string }) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Animated gradient blobs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-accent/30 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-primary/20 blur-3xl"
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-accent to-primary opacity-20 blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

export default AbstractHero;
