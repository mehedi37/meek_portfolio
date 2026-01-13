import type { Metadata } from "next";
import "../globals.css";
import { siteConfig } from "@/lib/constants";

// Metadata configuration
export const metadata: Metadata = {
  title: {
    default: `Admin | ${siteConfig.name}`,
    template: `%s | Admin - ${siteConfig.name}`,
  },
  description: "Admin dashboard for portfolio management",
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin Layout
 * Minimal layout for admin pages without public site navigation
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Main content */}
      <main id="main-content" className="relative">
        {children}
      </main>
    </div>
  );
}
