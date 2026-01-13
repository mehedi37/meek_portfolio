"use client";

import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef, useMemo } from "react";
import { usePrefersReducedMotion } from "@/hooks";

interface GrowingBoyProps {
  className?: string;
}

// SVG paths for different growth stages
const CHARACTER_STAGES = {
  child: {
    scale: 0.6,
    bodyHeight: 100,
    headSize: 40,
    armLength: 25,
    legLength: 35,
    color: "#4F46E5", // Indigo
  },
  teen: {
    scale: 0.75,
    bodyHeight: 130,
    headSize: 35,
    armLength: 35,
    legLength: 50,
    color: "#7C3AED", // Purple
  },
  youngAdult: {
    scale: 0.9,
    bodyHeight: 160,
    headSize: 32,
    armLength: 45,
    legLength: 65,
    color: "#2563EB", // Blue
  },
  professional: {
    scale: 1,
    bodyHeight: 180,
    headSize: 30,
    armLength: 50,
    legLength: 75,
    color: "#0891B2", // Cyan
  },
};

/**
 * Animated character component representing growth through career stages
 * Transforms smoothly based on scroll position
 */
export function GrowingBoy({ className = "" }: GrowingBoyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll();

  // Spring physics for smoother animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Transform scroll progress to character properties
  const scale = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [0.6, 0.75, 0.9, 1, 1]);
  const bodyHeight = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [100, 130, 160, 180, 180]);
  const headSize = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [40, 35, 32, 30, 30]);
  const armLength = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [25, 35, 45, 50, 50]);
  const legLength = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [35, 50, 65, 75, 75]);

  // Color transitions
  const hue = useTransform(smoothProgress, [0, 0.33, 0.66, 1], [240, 270, 220, 190]);

  // Subtle floating animation
  const y = useTransform(smoothProgress, [0, 0.5, 1], [0, -10, 0]);
  const rotation = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [-5, 0, 5, 0, -2]);

  // Props/accessories based on stage
  const showBook = useTransform(smoothProgress, [0, 0.2, 0.3], [0, 0, 1]);
  const showLaptop = useTransform(smoothProgress, [0.4, 0.5, 0.6], [0, 1, 1]);
  const showBriefcase = useTransform(smoothProgress, [0.7, 0.8, 0.9], [0, 1, 1]);

  if (prefersReducedMotion) {
    return (
      <div className={`w-48 h-64 ${className}`}>
        <CharacterSVGStatic stage="professional" />
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        scale,
        y,
        rotate: rotation,
      }}
    >
      <CharacterSVG
        bodyHeight={bodyHeight}
        headSize={headSize}
        armLength={armLength}
        legLength={legLength}
        hue={hue}
        showBook={showBook}
        showLaptop={showLaptop}
        showBriefcase={showBriefcase}
      />
    </motion.div>
  );
}

interface CharacterSVGProps {
  bodyHeight: MotionValue<number>;
  headSize: MotionValue<number>;
  armLength: MotionValue<number>;
  legLength: MotionValue<number>;
  hue: MotionValue<number>;
  showBook: MotionValue<number>;
  showLaptop: MotionValue<number>;
  showBriefcase: MotionValue<number>;
}

function CharacterSVG({
  bodyHeight,
  headSize,
  armLength,
  legLength,
  hue,
  showBook,
  showLaptop,
  showBriefcase,
}: CharacterSVGProps) {
  return (
    <svg
      viewBox="0 0 200 300"
      className="w-full h-full"
      style={{ minWidth: 150, minHeight: 250 }}
    >
      <defs>
        {/* Gradient for body */}
        <motion.linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <motion.stop
            offset="0%"
            style={{
              stopColor: useTransform(hue, (h) => `oklch(0.65 0.2 ${h})`),
            }}
          />
          <motion.stop
            offset="100%"
            style={{
              stopColor: useTransform(hue, (h) => `oklch(0.55 0.22 ${h})`),
            }}
          />
        </motion.linearGradient>

        {/* Shadow filter */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.2" />
        </filter>

        {/* Glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#shadow)">
        {/* Head */}
        <motion.circle
          cx="100"
          cy={useTransform(bodyHeight, (h) => 50)}
          r={headSize}
          fill="url(#bodyGradient)"
          className="transition-colors"
        />

        {/* Body */}
        <motion.rect
          x="75"
          y={useTransform(bodyHeight, (h) => 90 - h * 0.2)}
          width="50"
          height={useTransform(bodyHeight, (h) => h * 0.4)}
          rx="10"
          fill="url(#bodyGradient)"
        />

        {/* Left Arm */}
        <motion.line
          x1="75"
          y1={useTransform(bodyHeight, (h) => 100 - h * 0.15)}
          x2={useTransform(armLength, (a) => 75 - a)}
          y2={useTransform([bodyHeight, armLength], ([h, a]: number[]) => 100 - h * 0.15 + a * 0.8)}
          stroke="url(#bodyGradient)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Right Arm */}
        <motion.line
          x1="125"
          y1={useTransform(bodyHeight, (h) => 100 - h * 0.15)}
          x2={useTransform(armLength, (a) => 125 + a)}
          y2={useTransform([bodyHeight, armLength], ([h, a]: number[]) => 100 - h * 0.15 + a * 0.8)}
          stroke="url(#bodyGradient)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Left Leg */}
        <motion.line
          x1="85"
          y1={useTransform(bodyHeight, (h) => 90 + h * 0.2)}
          x2="70"
          y2={useTransform([bodyHeight, legLength], ([h, l]: number[]) => 90 + h * 0.2 + l)}
          stroke="url(#bodyGradient)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Right Leg */}
        <motion.line
          x1="115"
          y1={useTransform(bodyHeight, (h) => 90 + h * 0.2)}
          x2="130"
          y2={useTransform([bodyHeight, legLength], ([h, l]: number[]) => 90 + h * 0.2 + l)}
          stroke="url(#bodyGradient)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Eyes */}
        <motion.circle
          cx="90"
          cy={useTransform(bodyHeight, (h) => 45)}
          r="4"
          fill="#1e293b"
        />
        <motion.circle
          cx="110"
          cy={useTransform(bodyHeight, (h) => 45)}
          r="4"
          fill="#1e293b"
        />

        {/* Smile */}
        <motion.path
          d={useTransform(bodyHeight, () => "M 92 58 Q 100 65 108 58")}
          stroke="#1e293b"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Book (Teen stage) */}
        <motion.g opacity={showBook} filter="url(#glow)">
          <rect x="30" y="120" width="25" height="35" rx="2" fill="#F59E0B" />
          <line x1="35" y1="130" x2="50" y2="130" stroke="#fff" strokeWidth="1" />
          <line x1="35" y1="140" x2="50" y2="140" stroke="#fff" strokeWidth="1" />
        </motion.g>

        {/* Laptop (Young Adult stage) */}
        <motion.g opacity={showLaptop} filter="url(#glow)">
          <rect x="140" y="130" width="40" height="25" rx="2" fill="#334155" />
          <rect x="135" y="155" width="50" height="5" rx="1" fill="#475569" />
          <rect x="145" y="135" width="30" height="18" fill="#22D3EE" opacity="0.6" />
        </motion.g>

        {/* Briefcase (Professional stage) */}
        <motion.g opacity={showBriefcase} filter="url(#glow)">
          <rect x="25" y="180" width="35" height="28" rx="3" fill="#1e293b" />
          <rect x="35" y="175" width="15" height="8" rx="2" fill="#334155" />
          <rect x="30" y="190" width="25" height="2" fill="#64748b" />
        </motion.g>
      </g>
    </svg>
  );
}

interface CharacterSVGStaticProps {
  stage: keyof typeof CHARACTER_STAGES;
}

function CharacterSVGStatic({ stage }: CharacterSVGStaticProps) {
  const config = CHARACTER_STAGES[stage];

  return (
    <svg viewBox="0 0 200 300" className="w-full h-full">
      <defs>
        <linearGradient id="bodyGradientStatic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={config.color} />
          <stop offset="100%" stopColor={config.color} stopOpacity="0.8" />
        </linearGradient>
      </defs>

      <g>
        <circle cx="100" cy="50" r={config.headSize} fill="url(#bodyGradientStatic)" />
        <rect x="75" y="85" width="50" height={config.bodyHeight * 0.4} rx="10" fill="url(#bodyGradientStatic)" />
        <circle cx="90" cy="45" r="4" fill="#1e293b" />
        <circle cx="110" cy="45" r="4" fill="#1e293b" />
        <path d="M 92 58 Q 100 65 108 58" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default GrowingBoy;
