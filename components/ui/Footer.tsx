"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { siteConfig, navItems, socialLinks } from "@/lib/constants";
import { SocialLinks } from "./SocialLinks";
import { FaHeart, FaArrowUp } from "react-icons/fa";

interface FooterProps {
  className?: string;
}

/**
 * Professional site footer with navigation and social links
 */
export function Footer({ className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={`relative border-t border-border/50 bg-card/30 ${className}`}>
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xs">{"</>"}</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                {siteConfig.name.split(" ")[0]}
                <span className="text-muted-foreground">.dev</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
              Building modern, performant web applications with a focus on user 
              experience and clean code. Let&apos;s create something amazing together.
            </p>
            <SocialLinks size="md" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navItems.slice(0, 5).map((item) => (
                <li key={item.name}>
                  {item.href.startsWith("#") ? (
                    <button
                      onClick={() => {
                        const element = document.getElementById(item.href.slice(1));
                        if (element) {
                          const offset = 80;
                          const elementPosition = element.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - offset;
                          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                        }
                      }}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.links.email}`}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Email Me
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {currentYear} {siteConfig.name}. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                Built with <FaHeart className="text-accent" size={12} /> using Next.js
              </p>
              
              <motion.button
                onClick={scrollToTop}
                className="p-2 rounded-lg bg-secondary/80 text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Scroll to top"
              >
                <FaArrowUp size={14} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
