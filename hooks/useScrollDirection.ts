"use client";

import { useState, useEffect } from "react";

type ScrollDirection = "up" | "down" | null;

interface UseScrollDirectionOptions {
  threshold?: number;
}

interface ScrollDirectionResult {
  scrollDirection: ScrollDirection;
  scrollY: number;
}

/**
 * Hook to detect scroll direction and position
 * Returns scrollDirection ("up" | "down" | null) and current scrollY position
 * Includes a threshold to prevent jittery behavior
 */
export function useScrollDirection({ threshold = 10 }: UseScrollDirectionOptions = {}): ScrollDirectionResult {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;

      setScrollY(currentScrollY);

      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      setScrollDirection(currentScrollY > lastScrollY ? "down" : "up");
      setLastScrollY(currentScrollY > 0 ? currentScrollY : 0);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY, threshold]);

  return { scrollDirection, scrollY };
}
