import { type SiteConfig, type NavItem } from "@/types";

// Static site configuration - fallback values when DB is unavailable
export const siteConfig: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Portfolio",
  title: `Portfolio | ${process.env.NEXT_PUBLIC_SITE_NAME || "Developer"}`,
  description:
    "Software Engineer specializing in React, Next.js, TypeScript, and modern web technologies.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com",
  ogImage: "/og-image.png",
  links: {},
};

export const navItems: NavItem[] = [
  { name: "Home", href: "#hero" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Certifications", href: "#certifications" },
  { name: "Research", href: "#research" },
  // { name: "Contact", href: "#contact" },
];

// Single source of truth for homepage sections in scroll order - used for
// both scroll-spy active-section tracking (Navbar) and the floating dock nav
// (FloatingNavDots), which previously kept two separately hardcoded, already
// out-of-sync copies of this list.
export const HOME_SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certs" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
] as const;

// Stable id-only array, computed once - passing HOME_SECTIONS.map(s => s.id)
// inline at each call site would create a new array every render, which
// would defeat useActiveSection's effect dependency check.
export const HOME_SECTION_IDS = HOME_SECTIONS.map((s) => s.id);

// Animation timing constants
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  verySlow: 0.8,
} as const;

// Breakpoints matching Tailwind
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// Z-index scale
export const Z_INDEX = {
  background: 0,
  default: 1,
  content: 10,
  sticky: 50,
  fixed: 100,
  overlay: 200,
  modal: 300,
  popover: 400,
  tooltip: 500,
} as const;
