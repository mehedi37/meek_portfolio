"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter, FaArrowRight, FaChevronDown } from "react-icons/fa";
import { AbstractHero } from "@/components/animations";
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/animations";
import { siteConfig, socialLinks } from "@/lib/constants";

interface HeroProps {
  className?: string;
}

/**
 * Professional hero section with abstract animation
 * Clean, modern design with gradient accents
 */
export function Hero({ className = "" }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Subtle parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  // Social icon mapping
  const socialIcons: Record<string, React.ElementType> = {
    GitHub: FaGithub,
    LinkedIn: FaLinkedin,
    Twitter: FaTwitter,
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className={`relative min-h-screen flex items-center pt-16 overflow-hidden ${className}`}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px),
                             linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-[100px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-primary/15 blur-[100px]"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]"
          style={{ y, opacity }}
        >
          {/* Text Content */}
          <StaggerContainer className="text-center lg:text-left space-y-6 lg:space-y-8">
            {/* Status badge */}
            <StaggerItem>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20"
                whileHover={{ scale: 1.02 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                Available for new opportunities
              </motion.div>
            </StaggerItem>

            {/* Main heading */}
            <StaggerItem>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
                <span className="block text-foreground">Hi, I&apos;m</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_auto] animate-gradient">
                  {siteConfig.name}
                </span>
              </h1>
            </StaggerItem>

            {/* Role/title */}
            <StaggerItem>
              <p className="text-xl sm:text-2xl text-muted-foreground font-medium">
                Full Stack Developer
              </p>
            </StaggerItem>

            {/* Description */}
            <StaggerItem>
              <p className="text-base sm:text-lg text-muted-foreground/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                I craft modern, performant web applications with a focus on user experience 
                and clean code. Specializing in React, Next.js, and TypeScript.
              </p>
            </StaggerItem>

            {/* CTA Buttons */}
            <StaggerItem>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <motion.button
                  onClick={() => scrollToSection("projects")}
                  className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-accent to-primary rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View My Work
                  <FaArrowRight size={14} />
                </motion.button>
                
                <motion.button
                  onClick={() => scrollToSection("contact")}
                  className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-foreground bg-secondary/80 hover:bg-secondary border border-border/50 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get in Touch
                </motion.button>
              </div>
            </StaggerItem>

            {/* Social Links */}
            <StaggerItem>
              <div className="flex items-center gap-3 justify-center lg:justify-start pt-4">
                <span className="text-sm text-muted-foreground">Find me on</span>
                <div className="flex gap-2">
                  {socialLinks.map((link) => {
                    const Icon = socialIcons[link.name];
                    if (!Icon) return null;
                    return (
                      <motion.a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground/70 hover:text-foreground border border-border/30 hover:border-border/50 transition-all duration-200"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={link.name}
                      >
                        <Icon size={18} />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Abstract Hero Animation */}
          <FadeInSection
            direction="right"
            delay={0.3}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl aspect-square">
              <AbstractHero variant="geometric" className="w-full h-full" />
            </div>
          </FadeInSection>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={() => scrollToSection("skills")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          aria-label="Scroll to skills section"
        >
          <span className="text-xs font-medium tracking-wider uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FaChevronDown size={16} />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}

export default Hero;
