"use client";

import { motion } from "framer-motion";
import type { SocialLink } from "@/lib/supabase/types";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaInstagram, FaYoutube, FaDribbble, FaFacebook, FaDiscord, FaMedium, FaDev, FaStackOverflow } from "react-icons/fa";
import { SiHashnode } from "react-icons/si";

// Icon mapping - supports database icon field values and platform names
const iconMap: Record<string, React.ElementType> = {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaInstagram,
  FaYoutube,
  FaDribbble,
  FaFacebook,
  FaDiscord,
  FaMedium,
  FaDev,
  FaStackOverflow,
  SiHashnode,
  // Platform name mappings (lowercase)
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  email: FaEnvelope,
  instagram: FaInstagram,
  youtube: FaYoutube,
  dribbble: FaDribbble,
  facebook: FaFacebook,
  discord: FaDiscord,
  medium: FaMedium,
  dev: FaDev,
  stackoverflow: FaStackOverflow,
  hashnode: SiHashnode,
};

interface SocialLinksProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  vertical?: boolean;
  links?: SocialLink[];
}

/**
 * Social Links Component
 * Accepts database social links as props
 * Glass morphism design with gradient hover effects
 */
export function SocialLinks({
  className = "",
  size = "md",
  showLabels = false,
  vertical = false,
  links = [],
}: SocialLinksProps) {
  const sizeClasses = {
    sm: "p-2.5",
    md: "p-3",
    lg: "p-4",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  if (links.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex ${vertical ? "flex-col" : "flex-row"} gap-3 ${className}`}
    >
      {links.map((link, index) => {
        // Try icon field first, then platform name (lowercase)
        const IconComponent = iconMap[link.icon || ""] || iconMap[link.platform.toLowerCase()] || FaGithub;

        return (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-xl glass-card text-[var(--muted-foreground)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all duration-300 ${sizeClasses[size]}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            aria-label={link.platform}
          >
            <IconComponent size={iconSizes[size]} />
            {showLabels && (
              <span className="text-sm font-medium">{link.platform}</span>
            )}
          </motion.a>
        );
      })}
    </div>
  );
}

export default SocialLinks;
