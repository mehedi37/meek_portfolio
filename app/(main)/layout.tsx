import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";
import { Footer } from "@/components/ui";

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
 *
 * Conditional Navigation:
 * - Homepage: Full Navbar + FloatingNavDots
 * - Other pages: StickyBackButton only
 *
 * The Footer is a Server Component (async data fetching) so it's rendered here,
 * while ClientLayoutWrapper handles the client-side conditional navigation.
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      <Footer />
    </>
  );
}
