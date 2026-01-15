"use client";

import { useScrollDirection } from "@/hooks";
import { FloatingNavDots } from "./FloatingNavDots";

/**
 * Wrapper component that manages FloatingNavDots visibility
 * Shows dots when scrolled down and navbar is hidden
 */
export function FloatingNavWrapper() {
  const { scrollDirection, scrollY } = useScrollDirection({ threshold: 100 });

  // Show dots when scrolled past threshold and scrolling down (navbar hidden)
  const showDots = scrollY > 150 && scrollDirection === "down";

  return <FloatingNavDots show={showDots} />;
}
