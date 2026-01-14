"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, useCallback, useRef, ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Button/Element with magnetic hover effect
 * Follows cursor when hovering near it
 */
export function MagneticElement({
  children,
  className = "",
  strength = 30,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current || !isHovered) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      x.set(distanceX / (100 / strength));
      y.set(distanceY / (100 / strength));
    },
    [isHovered, strength, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }, [x, y]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

interface FloatingParticlesProps {
  count?: number;
  className?: string;
  colors?: string[];
}

/**
 * Floating particles background effect
 * Creates ambient animated particles
 */
export function FloatingParticles({
  count = 30,
  className = "",
  colors = ["#3B82F6", "#8B5CF6", "#F59E0B", "#10B981"],
}: FloatingParticlesProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      color: string;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, [count, colors]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

/**
 * Character-by-character text reveal animation
 */
export function TextReveal({
  text,
  className = "",
  delay = 0,
  staggerDelay = 0.03,
}: TextRevealProps) {
  const letters = text.split("");

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 20, rotateX: -90 },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
              },
            },
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface GlowingBorderProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  borderRadius?: string;
}

/**
 * Element with animated glowing border effect
 */
export function GlowingBorder({
  children,
  className = "",
  glowColor = "var(--accent)",
  borderRadius = "1rem",
}: GlowingBorderProps) {
  return (
    <div className={`relative group ${className}`}>
      {/* Animated glow */}
      <motion.div
        className="absolute -inset-[2px] rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          borderRadius,
          background: `linear-gradient(90deg, ${glowColor}, transparent, ${glowColor})`,
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "200% 0%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Inner content */}
      <div
        className="relative bg-background"
        style={{ borderRadius }}
      >
        {children}
      </div>
    </div>
  );
}

interface TypewriterProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

/**
 * Typewriter effect with multiple texts
 */
export function Typewriter({
  texts,
  className = "",
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypewriterProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetText = texts[currentTextIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < targetText.length) {
            setCurrentText(targetText.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isDeleting, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {currentText}
      <motion.span
        className="inline-block w-0.5 h-[1em] bg-accent ml-1"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      />
    </span>
  );
}

interface RippleEffectProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

/**
 * Click ripple effect wrapper
 */
export function RippleEffect({ children, className = "", color = "rgba(255,255,255,0.3)" }: RippleEffectProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: color,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default {
  MagneticElement,
  FloatingParticles,
  TextReveal,
  GlowingBorder,
  Typewriter,
  RippleEffect,
};
