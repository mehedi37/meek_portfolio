"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useEffect, useCallback } from "react";
import { Button, Avatar, Chip, Card } from "@heroui/react";
import { FaGithub, FaLinkedin, FaArrowRight, FaDownload } from "react-icons/fa";
import { HiSparkles, HiLocationMarker, HiLightningBolt, HiCode, HiGlobe } from "react-icons/hi";
import { siteConfig, socialLinks } from "@/lib/constants";

interface HeroProps {
  className?: string;
}

// Animated background gradient blob
function GradientBlob({
  size = 400,
  color = "accent",
  position = "top-left",
  delay = 0
}: {
  size?: number;
  color?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  delay?: number;
}) {
  const positionClasses = {
    "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
    "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
    "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
    "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${positionClasses[position]}`}
      style={{ width: size, height: size }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: [0.8, 1.2, 0.8],
        opacity: [0.1, 0.25, 0.1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className={`w-full h-full rounded-full ${color === "accent" ? "bg-accent" : "bg-success"}`} />
    </motion.div>
  );
}

// Status badge with pulse animation
function StatusBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Chip color="success" variant="soft" className="gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
        </span>
        Open to opportunities
      </Chip>
    </motion.div>
  );
}

// Quick stats card
function QuickStat({
  icon: Icon,
  value,
  label,
  delay = 0
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card variant="secondary" className="p-4 text-center hover:scale-105 transition-transform cursor-default">
        <Card.Content className="space-y-2 p-0">
          <Icon className="w-5 h-5 mx-auto text-accent" />
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted">{label}</div>
        </Card.Content>
      </Card>
    </motion.div>
  );
}

/**
 * Hero Section - Modern Bento-style layout
 * Uses HeroUI v3 semantic classes with Framer Motion animations
 */
export function Hero({ className = "" }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse tracking for interactive elements
  const mouseX = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });
  const mouseY = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX - innerWidth / 2) / 50);
    mouseY.set((clientY - innerHeight / 2) / 50);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className={`relative min-h-screen flex items-center overflow-hidden bg-background ${className}`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <GradientBlob size={600} color="accent" position="top-right" delay={0} />
        <GradientBlob size={500} color="success" position="bottom-left" delay={2} />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px),
                             linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        style={{ y, opacity }}
      >
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Profile Card - Spans 8 columns */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card variant="default" className="p-8 lg:p-10 h-full">
              <Card.Content className="space-y-8 p-0">
                {/* Status Badge */}
                <StatusBadge />

                {/* Profile Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar className="size-24 lg:size-28 ring-4 ring-surface ring-offset-2 ring-offset-background">
                      <Avatar.Image
                        alt={siteConfig.name}
                        src="https://img.heroui.chat/image/avatar?w=400&h=400&u=1"
                      />
                      <Avatar.Fallback className="text-2xl font-bold bg-accent text-white">
                        {siteConfig.name.split(' ').map(n => n[0]).join('')}
                      </Avatar.Fallback>
                    </Avatar>
                    {/* Online indicator */}
                    <span className="absolute bottom-1 right-1 w-5 h-5 bg-success rounded-full border-3 border-surface" />
                  </motion.div>

                  <div className="space-y-2">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
                      {siteConfig.name}
                    </h1>
                    <p className="text-xl lg:text-2xl text-muted font-medium">
                      Full Stack Developer
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-lg text-muted leading-relaxed max-w-2xl">
                  I craft beautiful, performant digital experiences that blend creativity
                  with clean code. Specializing in modern web technologies and turning
                  complex problems into elegant solutions.
                </p>

                {/* Info Pills */}
                <div className="flex flex-wrap gap-3">
                  <Chip variant="secondary" className="gap-2">
                    <HiLocationMarker className="w-4 h-4" />
                    Remote Worldwide
                  </Chip>
                  <Chip variant="secondary" className="gap-2">
                    <HiLightningBolt className="w-4 h-4" />
                    Available Now
                  </Chip>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onPress={() => scrollToSection("projects")}
                    className="group"
                  >
                    View My Work
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    onPress={() => scrollToSection("contact")}
                  >
                    Get In Touch
                  </Button>

                  <Button
                    variant="ghost"
                    size="lg"
                    isIconOnly
                    aria-label="Download Resume"
                  >
                    <FaDownload />
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Right Column - Stacked Cards */}
          <div className="lg:col-span-4 space-y-6">

            {/* Social Links Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card variant="secondary" className="p-6">
                <Card.Header className="p-0 pb-4">
                  <Card.Title className="text-sm font-medium text-muted uppercase tracking-wider">
                    Connect
                  </Card.Title>
                </Card.Header>
                <Card.Content className="p-0">
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <Button
                        key={social.name}
                        variant="ghost"
                        size="lg"
                        isIconOnly
                        as="a"
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        className="hover:bg-accent/10 hover:text-accent transition-colors"
                      >
                        {social.name === "GitHub" && <FaGithub className="w-5 h-5" />}
                        {social.name === "LinkedIn" && <FaLinkedin className="w-5 h-5" />}
                      </Button>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <QuickStat
                icon={HiCode}
                value="5+"
                label="Years Exp"
                delay={0.3}
              />
              <QuickStat
                icon={HiGlobe}
                value="50+"
                label="Projects"
                delay={0.4}
              />
            </div>

            {/* Tech Stack Preview Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Card
                variant="tertiary"
                className="p-6 cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={() => scrollToSection("skills")}
              >
                <Card.Content className="space-y-4 p-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted uppercase tracking-wider">
                      Tech Stack
                    </span>
                    <HiSparkles className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Next.js", "TypeScript", "Node.js"].map((tech) => (
                      <Chip key={tech} variant="soft" size="sm">
                        {tech}
                      </Chip>
                    ))}
                  </div>
                  <p className="text-sm text-muted">
                    Click to see all skills →
                  </p>
                </Card.Content>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.button
            onClick={() => scrollToSection("skills")}
            className="p-4 rounded-full bg-surface hover:bg-default transition-colors"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            aria-label="Scroll to next section"
          >
            <svg
              className="w-5 h-5 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
