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
 * ORBITAL Social Links
 * Glass morphism design with gradient hover effects
 */
export function SocialLinks({
  className = "",
  size = "md",
  showLabels = false,
  vertical = false,
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
            className={`flex items-center gap-2 rounded-xl glass-card text-[var(--muted-foreground)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all duration-300 ${sizeClasses[size]}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            aria-label={link.name}
          >
            <IconComponent size={iconSizes[size]} />
            {showLabels && (
              <span className="text-sm font-medium">{link.name}</span>
            )}
          </motion.a>
        );
      })}
    </div>
  );
}

export default SocialLinks;
