"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useActiveSection } from "@/hooks";
import { useState, useEffect } from "react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certs" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

interface FloatingNavDotsProps {
  show: boolean;
}

/**
 * Floating vertical dot navigation
 * Shows current section with animated indicator
 * Modern alternative to sticky section headers
 */
export function FloatingNavDots({ show }: FloatingNavDotsProps) {
  const activeSection = useActiveSection(sections.map(s => s.id), 200);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          aria-label="Section navigation"
        >
          {/* Glass background pill */}
          <div className="absolute inset-0 -m-3 bg-surface/60 backdrop-blur-md border border-separator/50 rounded-full" />

          {sections.map((section, index) => {
            const isActive = activeSection === section.id;
            const isHovered = hoveredSection === section.id;

            return (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
                className="relative z-10 p-1.5 group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                aria-label={`Go to ${section.label} section`}
                aria-current={isActive ? "true" : undefined}
              >
                {/* Dot */}
                <motion.div
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                    isActive
                      ? "bg-accent"
                      : "bg-muted/40 group-hover:bg-muted"
                  }`}
                  animate={{
                    scale: isActive ? 1.3 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />

                {/* Active glow */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 m-1 rounded-full bg-accent/30 blur-sm"
                    layoutId="active-glow"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Label tooltip */}
                <AnimatePresence>
                  {(isHovered || isActive) && (
                    <motion.span
                      className="absolute right-full mr-3 px-2.5 py-1 text-xs font-medium bg-surface border border-separator rounded-lg whitespace-nowrap shadow-lg"
                      initial={{ opacity: 0, x: 5, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 5, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                    >
                      {section.label}
                      {/* Arrow */}
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-1.5 h-1.5 bg-surface border-r border-t border-separator rotate-45" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}

          {/* Progress line connecting dots */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-accent/50 via-accent to-accent/50"
            style={{
              top: "0.75rem",
              height: `${(sections.findIndex(s => s.id === activeSection) / (sections.length - 1)) * 100}%`,
              maxHeight: "calc(100% - 1.5rem)",
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
