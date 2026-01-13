"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
 * Professional responsive navigation bar
 * Features icons, smooth scrolling, and mobile menu
 */
export function Navbar({ className = "" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const isMobile = useIsMobile();

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Determine active section based on scroll position
      const sections = ["hero", "skills", "projects", "experience", "contact"];
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

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);

    if (href.startsWith("#")) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        const offset = 80; // Account for fixed navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return activeSection === "hero";
    if (href.startsWith("#")) return activeSection === href.slice(1);
    return false;
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 ${className}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Navbar container with glass effect */}
        <div
          className={`transition-all duration-300 ${
            isScrolled
              ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm"
              : "bg-transparent"
          }`}
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-18">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Logo icon */}
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">{"</>"}</span>
                  </div>
                  {/* Logo text */}
                  <div className="hidden sm:block">
                    <span className="text-lg font-bold text-foreground">
                      {siteConfig.name.split(" ")[0]}
                    </span>
                    <span className="text-lg font-bold text-muted-foreground">.dev</span>
                  </div>
                </motion.div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = navIcons[item.name];
                  const active = isActive(item.href);

                  return (
                    <motion.div
                      key={item.name}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.href.startsWith("#") ? (
                        <button
                          onClick={() => handleNavClick(item.href)}
                          className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            active
                              ? "text-accent"
                              : "text-foreground/70 hover:text-foreground hover:bg-secondary/50"
                          }`}
                        >
                          {Icon && <Icon size={16} />}
                          <span>{item.name}</span>
                          {active && (
                            <motion.div
                              layoutId="activeNav"
                              className="absolute inset-0 rounded-lg bg-accent/10 border border-accent/20 -z-10"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all duration-200"
                        >
                          {Icon && <Icon size={16} />}
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-3">
                <ThemeToggle />

                {/* CTA Button - Desktop */}
                <motion.button
                  onClick={() => handleNavClick("#contact")}
                  className="hidden lg:flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-accent to-primary rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <HiMail size={16} />
                  <span>Hire Me</span>
                </motion.button>

                {/* Mobile Menu Button */}
                <motion.button
                  onClick={() => setIsOpen(!isOpen)}
                  className="lg:hidden p-2 text-foreground rounded-lg hover:bg-secondary/50 transition-colors"
                  whileTap={{ scale: 0.95 }}
                  aria-label="Toggle menu"
                  aria-expanded={isOpen}
                >
                  <AnimatePresence mode="wait">
                    {isOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <HiX size={24} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <HiMenu size={24} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", bounce: 0.25 }}
              className="fixed top-16 left-0 right-0 z-40 lg:hidden"
            >
              <div className="mx-4 p-4 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl">
                <nav className="space-y-1">
                  {navItems.map((item, index) => {
                    const Icon = navIcons[item.name];
                    const active = isActive(item.href);

                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {item.href.startsWith("#") ? (
                          <button
                            onClick={() => handleNavClick(item.href)}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                              active
                                ? "bg-accent/10 text-accent border border-accent/20"
                                : "text-foreground/80 hover:text-foreground hover:bg-secondary/50"
                            }`}
                          >
                            {Icon && <Icon size={20} />}
                            <span>{item.name}</span>
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/50 rounded-xl transition-all duration-200"
                          >
                            {Icon && <Icon size={20} />}
                            <span>{item.name}</span>
                          </Link>
                        )}
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.05 + 0.1 }}
                  className="mt-4 pt-4 border-t border-border/50"
                >
                  <button
                    onClick={() => handleNavClick("#contact")}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 text-base font-medium text-white bg-gradient-to-r from-accent to-primary rounded-xl shadow-md"
                  >
                    <HiMail size={18} />
                    <span>Hire Me</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
