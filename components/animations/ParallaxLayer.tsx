"use client";

import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef, ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks";

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  speed?: number; // Multiplier: < 1 = slower, > 1 = faster than scroll
  direction?: "vertical" | "horizontal";
  offset?: number; // Initial offset
  style?: React.CSSProperties; // Additional inline styles
}

/**
 * Creates a parallax scrolling effect for its children
 * Elements move at different speeds relative to scroll position
 */
export function ParallaxLayer({
  children,
  className = "",
  speed = 0.5,
  direction = "vertical",
  offset = 0,
  style,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 100, damping: 30 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Calculate movement based on speed
  const range = 100 * speed;
  const movement = useTransform(smoothProgress, [0, 1], [offset - range, offset + range]);

  if (prefersReducedMotion) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        [direction === "vertical" ? "y" : "x"]: movement,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Multi-layer parallax container
 * Creates depth with multiple layers moving at different speeds
 */
export function ParallaxContainer({
  children,
  className = "",
  layers,
}: {
  children?: ReactNode;
  className?: string;
  layers: Array<{
    content: ReactNode;
    speed: number;
    className?: string;
    zIndex?: number;
  }>;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {layers.map((layer, index) => (
        <ParallaxLayer
          key={index}
          speed={layer.speed}
          className={`absolute inset-0 ${layer.className || ""}`}
          style={{ zIndex: layer.zIndex || index }}
        >
          {layer.content}
        </ParallaxLayer>
      ))}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  imgClassName?: string;
}

/**
 * Image with parallax scrolling effect
 */
export function ParallaxImage({
  src,
  alt,
  speed = 0.3,
  className = "",
  imgClassName = "",
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  if (prefersReducedMotion) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <img src={src} alt={alt} className={`w-full h-full object-cover ${imgClassName}`} />
      </div>
    );
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${imgClassName}`}
        style={{
          y: useTransform(y, (v) => `calc(${v} * ${speed})`),
          scale,
        }}
      />
    </div>
  );
}

/**
 * Section with blurred background parallax effect
 */
export function BlurredParallaxSection({
  children,
  className = "",
  backgroundImage,
  backgroundColor,
  blurAmount = 12,
  overlayOpacity = 0.4,
}: {
  children: ReactNode;
  className?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  blurAmount?: number;
  overlayOpacity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const blur = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [blurAmount || 8, (blurAmount || 8) / 2, blurAmount || 8]
  );

  return (
    <section ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Background layer */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundColor: backgroundColor,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: useTransform(blur, (b) => `blur(${b}px)`),
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 -z-10 bg-background/60 dark:bg-background/80"
        style={{ opacity: overlayOpacity || 0.6 }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export default ParallaxLayer;
