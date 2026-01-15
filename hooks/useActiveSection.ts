"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect which section is currently active based on scroll position
 * Returns the section ID that is currently in view
 */
export function useActiveSection(sectionIds: string[], offset: number = 100) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Check sections in reverse order to prioritize lower sections
          for (const sectionId of [...sectionIds].reverse()) {
            const element = document.getElementById(sectionId);
            if (element) {
              const rect = element.getBoundingClientRect();
              // Section is active if its top is within the offset
              if (rect.top <= offset && rect.bottom > offset) {
                setActiveSection(sectionId);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Set initial active section
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
}
