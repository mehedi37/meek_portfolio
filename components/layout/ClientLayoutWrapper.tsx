"use client";

import { usePathname } from "next/navigation";
// Direct imports to avoid pulling in server-only Footer through barrel export
import { Navbar } from "@/components/ui/Navbar";
import { FloatingNavWrapper } from "@/components/ui/FloatingNavWrapper";
import { StickyBackButton } from "@/components/ui/StickyBackButton";
import {
  CursorGlow,
  FloatingShapes,
  GradientOrbs,
} from "@/components/animations";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

/**
 * Determines the appropriate back button config based on current path
 */
function getBackButtonConfig(pathname: string): { href: string; label: string } | null {
  // Don't show back button on homepage
  if (pathname === "/" || pathname === "") {
    return null;
  }

  // Project detail pages
  if (pathname.startsWith("/projects/") && pathname !== "/projects") {
    return { href: "/projects", label: "Back to Projects" };
  }

  // Research detail pages
  if (pathname.startsWith("/research/") && pathname !== "/research") {
    return { href: "/research", label: "Back to Research" };
  }

  // Projects listing page
  if (pathname === "/projects") {
    return { href: "/", label: "Back to Home" };
  }

  // Research listing page
  if (pathname === "/research") {
    return { href: "/", label: "Back to Home" };
  }

  // Certifications page
  if (pathname === "/certifications") {
    return { href: "/", label: "Back to Home" };
  }

  // Default for any other page
  return { href: "/", label: "Back to Home" };
}

/**
 * Client-side layout wrapper that handles conditional UI elements
 * - Homepage: Shows Navbar + FloatingNavWrapper
 * - Other pages: Shows StickyBackButton instead
 *
 * Note: Footer is rendered in the parent layout (server component)
 */
export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "";
  const backButtonConfig = getBackButtonConfig(pathname);

  return (
    <>
      {/* Background visual effects - fixed position, lowest z-index */}
      <GradientOrbs />
      <FloatingShapes />

      {/* Interactive cursor glow effect */}
      <CursorGlow />

      {/* Conditional navigation */}
      {isHomePage ? (
        <>
          {/* Full navbar on homepage */}
          <Navbar />
          {/* Floating dot navigation - shows when navbar is hidden */}
          <FloatingNavWrapper />
        </>
      ) : (
        <>
          {/* Sticky back button on other pages */}
          {backButtonConfig && (
            <StickyBackButton
              href={backButtonConfig.href}
              label={backButtonConfig.label}
            />
          )}
        </>
      )}

      {/* Main content with higher z-index than background effects */}
      <main id="main-content" className="relative z-10">
        {children}
      </main>
    </>
  );
}
