import { Navbar, Footer } from "@/components/ui";
import { ScrollProgress } from "@/components/animations";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Main site layout with navigation, footer, and scroll progress
 * Used for public-facing pages (home, blog, projects, etc.)
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main id="main-content" className="relative">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
