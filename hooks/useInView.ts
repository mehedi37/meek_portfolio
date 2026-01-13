"use client";

import { useEffect, useState, useRef, RefObject } from "react";

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
  triggerOnce?: boolean;
}

interface UseInViewReturn {
  ref: RefObject<HTMLDivElement | null>;
  isInView: boolean;
  hasBeenInView: boolean;
}

/**
 * Custom hook for detecting when an element enters the viewport
 * Uses IntersectionObserver for performance
 */
export function useInView(options: UseInViewOptions = {}): UseInViewReturn {
  const { threshold = 0.1, rootMargin = "0px", once = false, triggerOnce = false } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already triggered and once mode is enabled, skip
    if ((once || triggerOnce) && hasBeenInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);

        if (inView && !hasBeenInView) {
          setHasBeenInView(true);
        }

        // Disconnect if once mode and element is now in view
        if (inView && (once || triggerOnce)) {
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, triggerOnce, hasBeenInView]);

  return { ref, isInView, hasBeenInView };
}

/**
 * Simple hook that returns true when element is in view
 */
export function useIsInView(
  ref: RefObject<HTMLElement>,
  options: { threshold?: number; rootMargin?: string } = {}
): boolean {
  const [isInView, setIsInView] = useState(false);
  const { threshold = 0.1, rootMargin = "0px" } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  return isInView;
}
