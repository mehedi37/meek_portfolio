"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useEffect, useState, useId, useMemo } from "react";
import { usePrefersReducedMotion, useIsMobile } from "@/hooks";

/**
 * Floating geometric shapes that react to scroll position
 * Creates a dynamic, engaging background effect
 */
export function FloatingShapes() {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll();

  // Snappier catch-up to scroll position - the old stiffness: 50 read as laggy
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
  });

  // Shape configurations - memoized to prevent recreating on each render
  const allShapes = useMemo(() => [
    { type: "circle", size: 80, x: "10%", y: "15%", color: "primary", speed: 0.3, rotateSpeed: 0.5 },
    { type: "hexagon", size: 60, x: "85%", y: "25%", color: "secondary", speed: -0.2, rotateSpeed: -0.3 },
    { type: "triangle", size: 50, x: "75%", y: "60%", color: "accent", speed: 0.4, rotateSpeed: 0.8 },
    { type: "square", size: 40, x: "15%", y: "70%", color: "primary", speed: -0.35, rotateSpeed: -0.6 },
    { type: "circle", size: 100, x: "90%", y: "80%", color: "accent", speed: 0.25, rotateSpeed: 0.4 },
    { type: "hexagon", size: 70, x: "5%", y: "45%", color: "secondary", speed: -0.3, rotateSpeed: 0.7 },
    { type: "donut", size: 90, x: "50%", y: "10%", color: "primary", speed: 0.2, rotateSpeed: -0.5 },
    { type: "triangle", size: 45, x: "30%", y: "85%", color: "secondary", speed: -0.4, rotateSpeed: 0.9 },
  ], []);

  // Fewer shapes on mobile - smaller screens can't appreciate 8 of them anyway
  // and it's the least affordable place to spend GPU budget
  const shapes = isMobile ? allShapes.slice(0, 3) : allShapes;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || prefersReducedMotion) {
    return <div className="fixed inset-0 pointer-events-none z-0" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {shapes.map((shape, index) => (
        <FloatingShape
          key={index}
          {...shape}
          progress={smoothProgress}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}

interface FloatingShapeProps {
  type: string;
  size: number;
  x: string;
  y: string;
  color: string;
  speed: number;
  rotateSpeed: number;
  progress: any;
  delay: number;
}

function FloatingShape({ type, size, x, y, color, speed, rotateSpeed, progress, delay }: FloatingShapeProps) {
  const yOffset = useTransform(progress, [0, 1], [0, speed * 500]);
  const rotate = useTransform(progress, [0, 1], [0, rotateSpeed * 360]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.8, 1.1, 0.9]);
  const opacity = useTransform(progress, [0, 0.1, 0.9, 1], [0.15, 0.35, 0.35, 0.15]);

  // Tonal variations of the single violet accent (--color-primary/-light/-dark)
  // instead of unrelated cyan/magenta hues - a calmer, more professional feel
  // than three saturated colors glowing at once.
  const colorMap: Record<string, string> = {
    primary: "oklch(0.65 0.25 285 / 0.4)",
    secondary: "oklch(0.75 0.2 285 / 0.35)",
    accent: "oklch(0.5 0.28 285 / 0.35)",
  };

  return (
    <motion.div
      className="absolute"
      style={{
        left: x,
        top: y,
        y: yOffset,
        rotate,
        scale,
        opacity,
        willChange: "transform, opacity",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
    >
      <ShapeSVG type={type} size={size} fill={colorMap[color]} />
    </motion.div>
  );
}

// Glow is baked into the SVG fill via a radial gradient instead of a CSS
// `drop-shadow` filter - a filter re-blurs the whole shape on every animated
// frame (8 of these were running simultaneously), the gradient fill costs
// nothing extra at paint time.
function ShapeSVG({ type, size, fill }: { type: string; size: number; fill: string }) {
  const gradientId = useId();

  const shape = (() => {
    switch (type) {
      case "circle":
        return <circle cx="50" cy="50" r="45" fill={`url(#${gradientId})`} />;
      case "hexagon":
        return (
          <polygon
            points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
            fill={`url(#${gradientId})`}
          />
        );
      case "triangle":
        return <polygon points="50,10 90,90 10,90" fill={`url(#${gradientId})`} />;
      case "square":
        return (
          <rect x="10" y="10" width="80" height="80" rx="8" fill={`url(#${gradientId})`} />
        );
      case "donut":
        return (
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="12"
          />
        );
      default:
        return null;
    }
  })();

  if (!shape) return null;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id={gradientId}>
          <stop offset="60%" stopColor={fill} stopOpacity="1" />
          <stop offset="100%" stopColor={fill} stopOpacity="0.3" />
        </radialGradient>
      </defs>
      {shape}
    </svg>
  );
}

/**
 * Gradient orbs that move with scroll
 * Tonal violet variations for a calm, dynamic background
 */
export function GradientOrbs() {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll();

  const orb1Y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["20%", "-30%"]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], ["60%", "20%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || prefersReducedMotion) {
    return <div className="fixed inset-0 pointer-events-none z-0" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary orb - Electric Violet */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[50px]"
        style={{
          left: "-10%",
          top: orb1Y,
          background: "radial-gradient(circle, oklch(0.65 0.25 285 / 0.25) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />

      {/* Secondary orb - lighter violet tone (was Cyber Cyan) */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[45px]"
        style={{
          right: "-5%",
          top: orb2Y,
          background: "radial-gradient(circle, oklch(0.75 0.2 285 / 0.2) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />

      {/* Accent orb - darker violet tone (was Neon Magenta) - skipped on mobile, least visible of the three */}
      {!isMobile && (
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full blur-[35px]"
          style={{
            left: "40%",
            top: orb3Y,
            background: "radial-gradient(circle, oklch(0.5 0.28 285 / 0.15) 0%, transparent 70%)",
            willChange: "transform",
          }}
        />
      )}
    </div>
  );
}

/**
 * Interactive cursor glow effect
 * Follows the mouse with a trailing glow. Catch-up speed scales with how
 * fast the mouse is moving - a fixed-stiffness spring always felt sluggish
 * on quick flicks and needlessly slow when the mouse was barely moving.
 */
export function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const mouseRafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);

  const targetRef = useRef({ x: 0, y: 0 });
  const lastMoveRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const speedRef = useRef(0); // px/ms, decays each render tick
  const loopRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    setMounted(true);

    // Smoothing loop: lerp the rendered position toward the raw target each
    // frame, with the lerp factor scaled by recent mouse speed. Stops itself
    // once it's settled instead of running forever like a naive rAF loop.
    const SETTLE_EPSILON = 0.5;
    const MIN_ALPHA = 0.15;
    const MAX_ALPHA = 0.9;
    const SPEED_TO_ALPHA = 0.03;

    const runLoop = () => {
      const alpha = Math.min(
        MAX_ALPHA,
        Math.max(MIN_ALPHA, MIN_ALPHA + speedRef.current * SPEED_TO_ALPHA)
      );
      const curX = cursorX.get();
      const curY = cursorY.get();
      const dx = targetRef.current.x - curX;
      const dy = targetRef.current.y - curY;

      speedRef.current *= 0.9; // decay so stale speed doesn't linger after the mouse stops

      if (Math.abs(dx) < SETTLE_EPSILON && Math.abs(dy) < SETTLE_EPSILON) {
        cursorX.set(targetRef.current.x);
        cursorY.set(targetRef.current.y);
        loopRafRef.current = null;
        return;
      }

      cursorX.set(curX + dx * alpha);
      cursorY.set(curY + dy * alpha);
      loopRafRef.current = requestAnimationFrame(runLoop);
    };

    const ensureLoopRunning = () => {
      if (loopRafRef.current === null) {
        loopRafRef.current = requestAnimationFrame(runLoop);
      }
    };

    // Batch to one update per animation frame instead of once per raw
    // mousemove event (which can fire far more often than the display refreshes).
    const handleMouseMove = (e: MouseEvent) => {
      pendingRef.current = { x: e.clientX, y: e.clientY };
      if (mouseRafRef.current) return;
      mouseRafRef.current = requestAnimationFrame(() => {
        if (pendingRef.current) {
          const { x, y } = pendingRef.current;
          const now = performance.now();
          if (lastMoveRef.current) {
            const dt = Math.max(1, now - lastMoveRef.current.t);
            const dist = Math.hypot(x - lastMoveRef.current.x, y - lastMoveRef.current.y);
            speedRef.current = Math.max(speedRef.current, dist / dt);
          }
          lastMoveRef.current = { x, y, t: now };
          targetRef.current = { x, y };
          ensureLoopRunning();
        }
        mouseRafRef.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current);
      if (loopRafRef.current) cancelAnimationFrame(loopRafRef.current);
    };
  }, [cursorX, cursorY, prefersReducedMotion, isMobile]);

  if (!mounted || prefersReducedMotion || isMobile) return null;

  return (
    <motion.div
      // Plain opacity-based glow instead of `mix-blend-screen`, which forces
      // the compositor to recompute against everything underneath on every
      // tick - this looks near-identical against the site's dark/paper
      // backgrounds at a fraction of the paint cost.
      className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-[100]"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        background: "radial-gradient(circle, oklch(0.65 0.25 285 / 0.12) 0%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}

