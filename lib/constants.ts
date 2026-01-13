import { type SiteConfig, type NavItem, type SocialLink } from "@/types";

export const siteConfig: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Your Name",
  title: `Portfolio | ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Name"} - Full Stack Developer`,
  description:
    "Full Stack Developer specializing in React, Next.js, TypeScript, and modern web technologies. Explore my projects, skills, and professional journey.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    email: "your.email@example.com",
  },
};

export const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "#contact" },
];

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: siteConfig.links.github || "#",
    icon: "FaGithub",
  },
  {
    name: "LinkedIn",
    url: siteConfig.links.linkedin || "#",
    icon: "FaLinkedin",
  },
  {
    name: "Twitter",
    url: siteConfig.links.twitter || "#",
    icon: "FaTwitter",
  },
];

// Animation timing constants
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  verySlow: 0.8,
} as const;

// Scroll thresholds for Growing Boy stages
export const SCROLL_STAGES = {
  child: { start: 0, end: 0.25 },
  teen: { start: 0.25, end: 0.5 },
  youngAdult: { start: 0.5, end: 0.75 },
  professional: { start: 0.75, end: 1 },
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
