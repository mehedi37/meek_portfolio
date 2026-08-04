"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useActiveSection, usePrefersReducedMotion } from "@/hooks";
import { useEffect, useRef, useState } from "react";
import { HOME_SECTIONS as sections, HOME_SECTION_IDS } from "@/lib/constants";

interface FloatingNavDotsProps {
  show: boolean;
}

// Far outside any realistic viewport - guarantees zero magnification at rest
const REST_Y = -10000;
// How much the hovered bar grows (1 = doubles in scale)
const MAX_BOOST = 1;
// Falloff radius in px - controls how many neighboring bars visibly grow
const SIGMA = 28;

/**
 * Floating vertical dot navigation
 * Thin bars at rest; magnify toward the cursor like a macOS Dock,
 * with neighboring bars growing by distance-based falloff.
 */
export function FloatingNavDots({ show }: FloatingNavDotsProps) {
  const activeSection = useActiveSection(HOME_SECTION_IDS, 200);
  const prefersReducedMotion = usePrefersReducedMotion();
  const mouseY = useMotionValue(REST_Y);
  const rafRef = useRef<number | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion) return;
    const clientY = e.clientY;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      mouseY.set(clientY);
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    mouseY.set(REST_Y);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === activeSection)
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3 py-3 px-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          aria-label="Section navigation"
        >
          {/* Glass background pill */}
          <div className="absolute inset-0 bg-surface/60 backdrop-blur-md border border-separator/50 rounded-full" />

          {sections.map((section) => (
            <NavDot
              key={section.id}
              section={section}
              isActive={activeSection === section.id}
              mouseY={mouseY}
              reduceMotion={prefersReducedMotion}
              onClick={() => scrollToSection(section.id)}
            />
          ))}

          {/* Progress line connecting dots */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-accent/50 via-accent to-accent/50"
            style={{
              top: "0.75rem",
              height: `${(activeIndex / (sections.length - 1)) * 100}%`,
              maxHeight: "calc(100% - 1.5rem)",
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

interface NavDotProps {
  section: { id: string; label: string };
  isActive: boolean;
  mouseY: MotionValue<number>;
  reduceMotion: boolean;
  onClick: () => void;
}

function NavDot({ section, isActive, mouseY, reduceMotion, onClick }: NavDotProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const centerY = useRef(REST_Y);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const measure = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        centerY.current = rect.top + rect.height / 2;
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Dock-style Gaussian falloff: distance from cursor to this dot's own
  // measured center drives how much it magnifies, so neighbors grow too.
  const rawScale = useTransform(mouseY, (y) => {
    const distance = y - centerY.current;
    return 1 + MAX_BOOST * Math.exp(-(distance * distance) / (2 * SIGMA * SIGMA));
  });
  const scale = useSpring(rawScale, { stiffness: 400, damping: 22, mass: 0.5 });

  // Mouse: the container's own mousemove already drives `mouseY` continuously,
  // so hovering here only needs to toggle the tooltip - touching `mouseY`
  // directly would override the real cursor position with a hard snap.
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Keyboard: there's no continuous cursor position to fall back on, so
  // focusing a dot snaps `mouseY` to its center to get the same magnify feedback.
  const handleFocus = () => {
    if (!reduceMotion) mouseY.set(centerY.current);
    setIsHovered(true);
  };
  const handleBlur = () => {
    if (!reduceMotion) mouseY.set(REST_Y);
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="relative z-10 flex items-center justify-center px-1.5 py-1 group"
      style={{ scale: reduceMotion ? 1 : scale }}
      aria-label={`Go to ${section.label} section`}
      aria-current={isActive ? "true" : undefined}
    >
      {/* Bar */}
      <motion.div
        className={`w-1 rounded-full transition-colors duration-200 ${
          isActive ? "bg-accent" : "bg-muted/40 group-hover:bg-muted"
        }`}
        animate={{ height: isActive ? 20 : 14 }}
        transition={{ type: "spring", stiffness: 350, damping: 24 }}
      />

      {/* Active glow */}
      {isActive && (
        <motion.div
          className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-accent/30 blur-sm"
          layoutId="active-glow"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Label tooltip - grows out alongside the magnified bar */}
      <AnimatePresence>
        {(isHovered || isActive) && (
          <motion.span
            className="absolute right-full mr-3 px-2.5 py-1 text-xs font-medium bg-surface border border-separator rounded-lg whitespace-nowrap shadow-lg"
            initial={{ opacity: 0, x: 5, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 5, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
          >
            {section.label}
            {/* Arrow */}
            <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-1.5 h-1.5 bg-surface border-r border-t border-separator rotate-45" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
