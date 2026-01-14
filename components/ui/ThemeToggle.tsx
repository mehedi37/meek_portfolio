"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiSun, HiMoon } from "react-icons/hi";

interface ThemeToggleProps {
  className?: string;
}

/**
 * ORBITAL Theme Toggle
 * Animated toggle with glassmorphism design
 */
export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: "light" | "dark") => {
    const root = document.documentElement;

    if (newTheme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }

    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return <div className={`w-10 h-10 ${className}`} />;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-xl glass-card hover:bg-[var(--color-accent)]/10 transition-colors ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "light" ? 0 : 360,
          scale: 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        {theme === "light" ? (
          <HiSun className="w-5 h-5 text-amber-500" />
        ) : (
          <HiMoon className="w-5 h-5 text-[var(--color-accent)]" />
        )}
      </motion.div>
    </motion.button>
  );
}

export default ThemeToggle;
