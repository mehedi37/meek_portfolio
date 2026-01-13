"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Switch, Label } from "@heroui/react";
import { FaSun, FaMoon } from "react-icons/fa";

interface ThemeToggleProps {
  className?: string;
}

/**
 * Theme toggle button for switching between light and dark modes
 * Persists preference to localStorage
 */
export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  // Only render after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);

    // Check for saved preference or system preference
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

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <div className={`w-10 h-10 ${className}`} />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "light" ? 0 : 180,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        {theme === "light" ? (
          <FaSun className="text-yellow-500" size={18} />
        ) : (
          <FaMoon className="text-blue-400" size={18} />
        )}
      </motion.div>
    </motion.button>
  );
}

export default ThemeToggle;
