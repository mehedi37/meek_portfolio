"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";
import { navItems, siteConfig } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "@/hooks";
import {
  HiHome,
  HiLightningBolt,
  HiCollection,
  HiBriefcase,
  HiNewspaper,
  HiMail,
  HiMenu,
  HiX,
} from "react-icons/hi";

// Icon mapping for nav items
const navIcons: Record<string, React.ElementType> = {
  Home: HiHome,
  Skills: HiLightningBolt,
  Projects: HiCollection,
  Experience: HiBriefcase,
  Blog: HiNewspaper,
  Contact: HiMail,
};

interface NavbarProps {
  className?: string;
}

/**
 * Navigation Bar with HeroUI semantics
 * Clean design with smooth animations
 */
export function Navbar({ className = "" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const isMobile = useIsMobile();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Determine active section
      const sections = ["hero", "skills", "projects", "experience", "blog", "contact"];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);

    // Handle hash links for scrolling
    if (href.startsWith("#")) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (href === "/") {
      // Home link - scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isActive = (href: string) => {
    if (href === "/" || href === "#hero") return activeSection === "hero";
    if (href.startsWith("#")) return activeSection === href.slice(1);
    return false;
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 ${className}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <nav
          className={`mx-auto p-8 sm:px-6 lg:p-8 transition-all duration-300 ${
            isScrolled ? "py-3" : "py-4"
          }`}
        >
          <div
            className={`flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all duration-300 ${
              isScrolled
                ? "bg-surface/80 backdrop-blur-md border border-separator shadow-lg"
                : "bg-transparent"
            }`}
          >
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-3"
              onClick={() => handleNavClick("/")}
            >
              <motion.div
                className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                {siteConfig.name.charAt(0)}
              </motion.div>
              <span className="hidden sm:block font-semibold text-lg group-hover:text-accent transition-colors">
                {siteConfig.name.split(" ")[0]}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = navIcons[item.name];
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith("#")) {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }
                    }}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      active
                        ? "text-accent"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.name}</span>
                    {active && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-accent/10"
                        layoutId="navbar-indicator"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {/* CTA Button - Desktop only */}
              <div className="hidden md:block">
                <Button
                  variant="primary"
                  size="sm"
                  onPress={() => handleNavClick("#contact")}
                >
                  Hire Me
                </Button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-xl bg-surface border border-separator"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? (
                  <HiX className="w-6 h-6" />
                ) : (
                  <HiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-surface border-l border-separator rounded-l-3xl p-6 md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
            >
              {/* Close button */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-default transition-colors"
                  aria-label="Close menu"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              {/* Menu items */}
              <nav className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = navIcons[item.name];
                  const active = isActive(item.href);

                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => {
                          if (item.href.startsWith("#")) {
                            e.preventDefault();
                          }
                          handleNavClick(item.href);
                        }}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${
                          active
                            ? "bg-accent/10 text-accent"
                            : "hover:bg-default"
                        }`}
                      >
                        {Icon && <Icon className="w-5 h-5" />}
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile CTA */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onPress={() => handleNavClick("#contact")}
                >
                  Get In Touch
                </Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
