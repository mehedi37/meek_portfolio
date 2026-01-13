"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { siteConfig, navItems } from "@/lib/constants";
import { SocialLinks } from "./SocialLinks";
import { HiArrowUp, HiHeart, HiCode, HiMail } from "react-icons/hi";

interface FooterProps {
  className?: string;
}

/**
 * ORBITAL Footer
 * Glassmorphism design with gradient accents
 */
export function Footer({ className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = navItems.filter(item => 
    ["Skills", "Projects", "Experience", "Blog"].includes(item.name)
  );

  return (
    <footer className={`relative overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-secondary)] to-transparent opacity-50" />
      
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] flex items-center justify-center text-white font-bold text-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                {siteConfig.name.charAt(0)}
              </motion.div>
              <div>
                <span className="text-xl font-bold block">
                  {siteConfig.name.split(" ")[0]}
                  <span className="text-[var(--muted-foreground)]">.dev</span>
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Full Stack Developer
                </span>
              </div>
            </Link>
            
            <p className="text-[var(--muted-foreground)] max-w-md mb-8 leading-relaxed">
              Building modern, performant web applications with a focus on user 
              experience and clean code. Let&apos;s create something amazing together.
            </p>

            <SocialLinks size="md" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-6 flex items-center gap-2">
              <HiCode className="w-4 h-4 text-[var(--color-accent)]" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  {item.href.startsWith("#") ? (
                    <button
                      onClick={() => {
                        const element = document.getElementById(item.href.slice(1));
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="text-[var(--muted-foreground)] hover:text-[var(--color-accent)] transition-colors duration-300 text-sm"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-[var(--muted-foreground)] hover:text-[var(--color-accent)] transition-colors duration-300 text-sm"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-6 flex items-center gap-2">
              <HiMail className="w-4 h-4 text-[var(--color-accent)]" />
              Get In Touch
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-[var(--muted-foreground)] hover:text-[var(--color-accent)] transition-colors duration-300 text-sm"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <span className="text-[var(--muted-foreground)] text-sm">
                  {siteConfig.location}
                </span>
              </li>
              <li className="pt-4">
                <button
                  onClick={() => {
                    const element = document.getElementById("contact");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline"
                >
                  Send a message →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[var(--glass-border)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-1">
              © {currentYear} {siteConfig.name}. Made with{" "}
              <HiHeart className="w-4 h-4 text-red-500 animate-pulse" />{" "}
              using Next.js
            </p>

            {/* Scroll to top */}
            <motion.button
              onClick={scrollToTop}
              className="glass-card p-3 rounded-xl hover:bg-[var(--color-accent)]/10 transition-colors group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll to top"
            >
              <HiArrowUp className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--color-accent)] transition-colors" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[var(--gradient-start)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--gradient-mid)]/5 rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
}
