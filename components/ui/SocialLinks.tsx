"use client";

import { motion } from "framer-motion";
import { socialLinks } from "@/lib/constants";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaInstagram, FaYoutube, FaDribbble } from "react-icons/fa";

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaInstagram,
  FaYoutube,
  FaDribbble,
};

interface SocialLinksProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  vertical?: boolean;
}

/**
 * Social media links with icons and hover effects
 * Configurable size and layout
 */
export function SocialLinks({
  className = "",
  size = "md",
  showLabels = false,
  vertical = false,
}: SocialLinksProps) {
  const sizeClasses = {
    sm: "p-2 text-sm",
    md: "p-3 text-base",
    lg: "p-4 text-lg",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div
      className={`flex ${vertical ? "flex-col" : "flex-row"} gap-3 ${className}`}
    >
      {socialLinks.map((link, index) => {
        const IconComponent = iconMap[link.icon] || FaGithub;

        return (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-full bg-secondary/50 hover:bg-secondary text-foreground hover:text-accent transition-colors ${sizeClasses[size]}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            aria-label={link.name}
          >
            <IconComponent size={iconSizes[size]} />
            {showLabels && <span>{link.name}</span>}
          </motion.a>
        );
      })}
    </div>
  );
}

export default SocialLinks;
