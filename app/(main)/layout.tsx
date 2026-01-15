import { Navbar, Footer, FloatingNavWrapper } from "@/components/ui";
import {
  ScrollProgress,
  CursorGlow,
  FloatingShapes,
  GradientOrbs,
} from "@/components/animations";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Main site layout with navigation, footer, and visual effects
 * Used for public-facing pages (home, blog, projects, etc.)
 *
 * Visual Elements:
 * - ScrollProgress: Progress bar at the top
 * - CursorGlow: Interactive mouse-following glow effect
 * - FloatingShapes: Geometric shapes that react to scroll
 * - GradientOrbs: Colorful gradient blobs that move with scroll
 * - FloatingNavDots: Vertical dot navigation when navbar hidden
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      {/* Background visual effects - fixed position, lowest z-index */}
      <GradientOrbs />
      <FloatingShapes />

      {/* Scroll progress indicator - highest z-index */}
      <ScrollProgress />

      {/* Interactive cursor glow effect */}
      <CursorGlow />

      {/* Navigation - high z-index to stay above content */}
      <Navbar />

      {/* Floating dot navigation - shows when navbar is hidden */}
      <FloatingNavWrapper />

      {/* Main content with higher z-index than background effects */}
      <main id="main-content" className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
