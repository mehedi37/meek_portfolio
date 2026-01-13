"use client";

import { motion, useInView as useFramerInView, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks";

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
  threshold?: number;
  blur?: boolean;
  scale?: boolean;
}

/**
 * Wrapper component that fades in children when they enter the viewport
 * Supports multiple animation directions and effects
 */
export function FadeInSection({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  direction = "up",
  distance = 30,
  once = true,
  threshold = 0.2,
  blur = false,
  scale = false,
}: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useFramerInView(ref, { once, amount: threshold });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Get initial position based on direction
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      default:
        return {};
    }
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
      filter: blur ? "blur(10px)" : "blur(0px)",
      scale: scale ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.4, 0.25, 1], // Custom easing
      },
    },
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered children animation wrapper
 * Each child animates in sequence with a delay
 */
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  containerDelay = 0,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  containerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useFramerInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: containerDelay,
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child item for StaggerContainer
 */
export function StaggerItem({
  children,
  className = "",
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const getOffset = () => {
    const distance = 20;
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
    }
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      ...getOffset(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

export default FadeInSection;
