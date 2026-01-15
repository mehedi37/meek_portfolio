"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft, FaHome } from "react-icons/fa";

interface StickyBackButtonProps {
  href: string;
  label: string;
  icon?: "arrow" | "home";
}

/**
 * Sticky back button for non-homepage pages
 * Shows at the top of the page with smooth animations
 */
export function StickyBackButton({ 
  href, 
  label,
  icon = "arrow"
}: StickyBackButtonProps) {
  const Icon = icon === "home" ? FaHome : FaArrowLeft;

  return (
    <motion.div
      className="fixed top-4 left-4 z-50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={href}>
        <motion.button
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface/80 backdrop-blur-md border border-separator/50 shadow-lg hover:bg-surface hover:border-accent/30 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
          <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
            {label}
          </span>
        </motion.button>
      </Link>
    </motion.div>
  );
}
