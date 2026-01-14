"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from "framer-motion";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";

/**
 * Floating geometric shapes that react to scroll position
 * Creates a dynamic, engaging background effect
 */
export function FloatingShapes() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
  });

  // Shape configurations - memoized to prevent recreating on each render
  const shapes = useMemo(() => [
    { type: "circle", size: 80, x: "10%", y: "15%", color: "primary", speed: 0.3, rotateSpeed: 0.5 },
    { type: "hexagon", size: 60, x: "85%", y: "25%", color: "secondary", speed: -0.2, rotateSpeed: -0.3 },
    { type: "triangle", size: 50, x: "75%", y: "60%", color: "accent", speed: 0.4, rotateSpeed: 0.8 },
    { type: "square", size: 40, x: "15%", y: "70%", color: "primary", speed: -0.35, rotateSpeed: -0.6 },
    { type: "circle", size: 100, x: "90%", y: "80%", color: "accent", speed: 0.25, rotateSpeed: 0.4 },
    { type: "hexagon", size: 70, x: "5%", y: "45%", color: "secondary", speed: -0.3, rotateSpeed: 0.7 },
    { type: "donut", size: 90, x: "50%", y: "10%", color: "primary", speed: 0.2, rotateSpeed: -0.5 },
    { type: "triangle", size: 45, x: "30%", y: "85%", color: "secondary", speed: -0.4, rotateSpeed: 0.9 },
  ], []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
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

  const colorMap: Record<string, string> = {
    primary: "oklch(0.65 0.25 285 / 0.4)",
    secondary: "oklch(0.75 0.15 195 / 0.35)",
    accent: "oklch(0.7 0.25 330 / 0.35)",
  };

  const glowMap: Record<string, string> = {
    primary: "0 0 40px oklch(0.65 0.25 285 / 0.3)",
    secondary: "0 0 40px oklch(0.75 0.15 195 / 0.25)",
    accent: "0 0 40px oklch(0.7 0.25 330 / 0.25)",
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
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
    >
      <ShapeSVG
        type={type}
        size={size}
        fill={colorMap[color]}
        glow={glowMap[color]}
      />
    </motion.div>
  );
}

function ShapeSVG({ type, size, fill, glow }: { type: string; size: number; fill: string; glow: string }) {
  const style = { filter: `drop-shadow(${glow})` };

  switch (type) {
    case "circle":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
          <circle cx="50" cy="50" r="45" fill={fill} />
        </svg>
      );
    case "hexagon":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill={fill} />
        </svg>
      );
    case "triangle":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
          <polygon points="50,10 90,90 10,90" fill={fill} />
        </svg>
      );
    case "square":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
          <rect x="10" y="10" width="80" height="80" rx="8" fill={fill} />
        </svg>
      );
    case "donut":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
          <circle cx="50" cy="50" r="45" fill="none" stroke={fill} strokeWidth="12" />
        </svg>
      );
    default:
      return null;
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

/**
 * Interactive particle constellation background
 * Particles connect when close together, creating a network effect
 */
export function ParticleField({ particleCount = 50 }: { particleCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const colors = [
      "oklch(0.65 0.25 285 / 0.6)", // primary
      "oklch(0.75 0.15 195 / 0.5)", // secondary
      "oklch(0.7 0.25 330 / 0.5)",  // accent
    ];

    particles.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.current.forEach((particle, i) => {
        // Mouse interaction
        const dx = mousePos.current.x - particle.x;
        const dy = mousePos.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const force = (150 - dist) / 150;
          particle.vx -= (dx / dist) * force * 0.02;
          particle.vy -= (dy / dist) * force * 0.02;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Draw connections
        particles.current.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `oklch(0.65 0.15 285 / ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount]);

  if (!mounted) {
    return <div className="fixed inset-0 pointer-events-none z-0" />;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

/**
 * Gradient orbs that move with scroll
 * Creates a colorful, dynamic background
 */
export function GradientOrbs() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  const orb1Y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["20%", "-30%"]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], ["60%", "20%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 pointer-events-none z-0" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary orb - Electric Violet */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px]"
        style={{
          left: "-10%",
          top: orb1Y,
          background: "radial-gradient(circle, oklch(0.65 0.25 285 / 0.25) 0%, transparent 70%)",
        }}
      />

      {/* Secondary orb - Cyber Cyan */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[80px]"
        style={{
          right: "-5%",
          top: orb2Y,
          background: "radial-gradient(circle, oklch(0.75 0.15 195 / 0.2) 0%, transparent 70%)",
        }}
      />

      {/* Accent orb - Neon Magenta */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[60px]"
        style={{
          left: "40%",
          top: orb3Y,
          background: "radial-gradient(circle, oklch(0.7 0.25 330 / 0.15) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

/**
 * Interactive cursor glow effect
 * Follows the mouse with a trailing glow
 */
export function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-[100] mix-blend-screen"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
        background: "radial-gradient(circle, oklch(0.65 0.25 285 / 0.15) 0%, transparent 70%)",
      }}
    />
  );
}

/**
 * Scroll-triggered counter animation
 */
export function AnimatedCounter({
  value,
  suffix = "",
  duration = 2
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const startTime = Date.now();
          const endTime = startTime + duration * 1000;

          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / (duration * 1000), 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

            setCount(Math.floor(easeProgress * value));

            if (now < endTime) {
              requestAnimationFrame(animate);
            } else {
              setCount(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

/**
 * Scroll-triggered text reveal with gradient
 */
export function GradientTextReveal({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.3"],
  });

  const backgroundSize = useTransform(scrollYProgress, [0, 1], ["0% 100%", "100% 100%"]);

  return (
    <motion.div
      ref={ref}
      className={`bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-secondary)] bg-clip-text text-transparent bg-no-repeat ${className}`}
      style={{ backgroundSize }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Section divider with animated line
 */
export function AnimatedDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.5"],
  });

  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative w-full h-px my-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent origin-center"
        style={{ scaleX }}
      />
    </div>
  );
}
