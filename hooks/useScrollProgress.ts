"use client";

import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import type { AnimationStage } from "@/types";
import { SCROLL_STAGES } from "@/lib/constants";

interface ScrollProgressConfig {
  offset?: ["start start" | "start end" | "end start" | "end end", "start start" | "start end" | "end start" | "end end"];
  smooth?: number;
}

interface ScrollProgressReturn {
  scrollYProgress: MotionValue<number>;
  currentStage: AnimationStage;
  stageProgress: {
    child: MotionValue<number>;
    teen: MotionValue<number>;
    youngAdult: MotionValue<number>;
    professional: MotionValue<number>;
  };
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook for tracking scroll progress and animation stages
 * Used primarily for the Growing Boy animation
 */
export function useScrollProgress(config?: ScrollProgressConfig): ScrollProgressReturn {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: config?.offset || ["start start", "end end"],
  });

  // Create progress values for each stage
  const childProgress = useTransform(
    scrollYProgress,
    [SCROLL_STAGES.child.start, SCROLL_STAGES.child.end],
    [0, 1]
  );

  const teenProgress = useTransform(
    scrollYProgress,
    [SCROLL_STAGES.teen.start, SCROLL_STAGES.teen.end],
    [0, 1]
  );

  const youngAdultProgress = useTransform(
    scrollYProgress,
    [SCROLL_STAGES.youngAdult.start, SCROLL_STAGES.youngAdult.end],
    [0, 1]
  );

  const professionalProgress = useTransform(
    scrollYProgress,
    [SCROLL_STAGES.professional.start, SCROLL_STAGES.professional.end],
    [0, 1]
  );

  // Determine current stage based on scroll progress
  const getCurrentStage = (): AnimationStage => {
    const progress = scrollYProgress.get();
    if (progress < SCROLL_STAGES.teen.start) return "child";
    if (progress < SCROLL_STAGES.youngAdult.start) return "teen";
    if (progress < SCROLL_STAGES.professional.start) return "youngAdult";
    return "professional";
  };

  return {
    scrollYProgress,
    currentStage: getCurrentStage(),
    stageProgress: {
      child: childProgress,
      teen: teenProgress,
      youngAdult: youngAdultProgress,
      professional: professionalProgress,
    },
    containerRef,
  };
}

/**
 * Simplified scroll progress hook for general use
 */
export function useSimpleScrollProgress() {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
}
