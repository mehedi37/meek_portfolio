"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button, Avatar, Chip, Card, Tooltip } from "@heroui/react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaArrowRight,
  FaDownload,
  FaCalendarCheck,
} from "react-icons/fa";
import {
  HiSparkles,
  HiLocationMarker,
  HiLightningBolt,
  HiCode,
  HiGlobe,
} from "react-icons/hi";
import type { SiteProfile, SocialLink } from "@/lib/supabase/types";
import { IconRenderer } from "@/components/admin/IconSearch";

interface HeroProps {
  className?: string;
  profile?: SiteProfile | null;
  socialLinks?: SocialLink[];
}

// Animated background gradient blob
function GradientBlob({
  size = 400,
  color = "accent",
  position = "top-left",
  delay = 0,
}: {
  size?: number;
  color?: string;
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  delay?: number;
}) {
  const positionClasses = {
    "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
    "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
    "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
    "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
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
      <div
        className={`w-full h-full rounded-full ${
          color === "accent" ? "bg-accent" : "bg-success"
        }`}
      />
    </motion.div>
  );
}

// Status badge with pulse animation
function StatusBadge({
  status,
  statusColor = "success",
}: {
  status?: string | null;
  statusColor?: string | null;
}) {
  const displayStatus = status || "Open to opportunities";
  const colorClass =
    statusColor === "success"
      ? "bg-success"
      : statusColor === "warning"
      ? "bg-warning"
      : statusColor === "danger"
      ? "bg-danger"
      : "bg-accent";
  const chipColor =
    statusColor === "success"
      ? "success"
      : statusColor === "warning"
      ? "warning"
      : statusColor === "danger"
      ? "danger"
      : "default";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Chip
        color={chipColor as "success" | "warning" | "danger" | "default"}
        variant="soft"
        className="gap-2"
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorClass} opacity-75`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${colorClass}`}
          />
        </span>
        {displayStatus}
      </Chip>
    </motion.div>
  );
}

// Quick stats card
function QuickStat({
  icon: Icon,
  value,
  label,
  delay = 0,
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
      <Card
        variant="secondary"
        className="p-4 text-center hover:scale-105 transition-transform cursor-default"
      >
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
export function Hero({ className = "", profile, socialLinks = [] }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback values if no profile data - use correct database field names
  // console.log("Profile data in Hero:", profile);
  const name = profile?.full_name || "Your Name";
  const shortName = profile?.short_name || "YN";
  const tagline = profile?.tagline || "Software Engineer";
  const aboutMe =
    profile?.about_me ||
    "I craft beautiful, performant digital experiences that blend creativity with clean code.";
  const profileImage =
    profile?.profile_image ||
    "https://img.heroui.chat/image/avatar?w=400&h=400&u=1";
  const location = profile?.location || "Remote Worldwide";
  const yearsExperience = profile?.years_experience ?? 5;
  const completedProjects = profile?.completed_projects ?? 50;
  const status = profile?.status;
  const statusColor = profile?.status_color;
  const resumeUrl = profile?.resume_url;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms - using higher threshold for mobile-friendly fade
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Mouse tracking for interactive elements
  const mouseX = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });
  const mouseY = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    },
    [mouseX, mouseY]
  );

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
      className={`relative min-h-screen flex items-center overflow-hidden ${className}`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <GradientBlob
          size={600}
          color="accent"
          position="top-right"
          delay={0}
        />
        <GradientBlob
          size={500}
          color="success"
          position="bottom-left"
          delay={2}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px),
                             linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
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
                <StatusBadge status={status} statusColor={statusColor} />

                {/* Profile Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 600 }}
                  >
                    <Avatar className="size-24 lg:size-28 ring-4 ring-surface ring-offset-2 ring-offset-background">
                      <Avatar.Image alt={name} src={profileImage} />
                      <Avatar.Fallback className="text-2xl font-bold bg-accent text-white">
                        {shortName}
                      </Avatar.Fallback>
                    </Avatar>
                    {/* Online indicator */}
                    <span className="absolute bottom-1 right-1 w-5 h-5 bg-success rounded-full border-3 border-surface" />
                  </motion.div>

                  <div className="space-y-2">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
                      {name}
                    </h1>
                    <p className="text-xl lg:text-2xl text-muted font-medium">
                      {tagline}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-lg text-muted leading-relaxed max-w-2xl">
                  {aboutMe}
                </p>

                {/* Info Pills */}
                <div className="flex flex-wrap gap-3">
                  <Chip variant="secondary" className="gap-2">
                    <HiLocationMarker className="w-4 h-4" />
                    {location}
                  </Chip>
                  {statusColor === "success" && (
                    <Chip variant="secondary" className="gap-2">
                      <HiLightningBolt className="w-4 h-4" />
                      Available Now
                    </Chip>
                  )}
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

                  {resumeUrl && (
                    <Tooltip delay={0} closeDelay={100}>
                      <Tooltip.Content>
                        <p>My Resume</p>
                      </Tooltip.Content>
                      <Button isIconOnly variant="ghost">
                        <Link
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Download Resume"
                          className="inline-flex items-center justify-center rounded-full bg-surface hover:bg-default w-12 h-12 transition-colors"
                        >
                          <FaDownload className="w-5 h-5" />
                        </Link>
                      </Button>
                    </Tooltip>
                  )}
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
                    {socialLinks.length > 0 ? (
                      socialLinks.map((social) => (
                        <Link
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.platform}
                          className="inline-flex items-center justify-center rounded-full bg-surface hover:bg-accent/10 hover:text-accent w-12 h-12 transition-colors"
                        >
                          {social.icon ? (
                            <IconRenderer
                              name={social.icon}
                              className="w-5 h-5"
                            />
                          ) : social.platform === "GitHub" ? (
                            <FaGithub className="w-5 h-5" />
                          ) : social.platform === "LinkedIn" ? (
                            <FaLinkedin className="w-5 h-5" />
                          ) : social.platform === "Twitter" ? (
                            <FaTwitter className="w-5 h-5" />
                          ) : (
                            <FaGithub className="w-5 h-5" />
                          )}
                        </Link>
                      ))
                    ) : (
                      <>
                        <Link
                          href="#"
                          aria-label="GitHub"
                          className="inline-flex items-center justify-center rounded-full bg-surface hover:bg-accent/10 hover:text-accent w-12 h-12 transition-colors"
                        >
                          <FaGithub className="w-5 h-5" />
                        </Link>
                        <Link
                          href="#"
                          aria-label="LinkedIn"
                          className="inline-flex items-center justify-center rounded-full bg-surface hover:bg-accent/10 hover:text-accent w-12 h-12 transition-colors"
                        >
                          <FaLinkedin className="w-5 h-5" />
                        </Link>
                      </>
                    )}
                  </div>
                </Card.Content>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <QuickStat
                icon={FaCalendarCheck}
                value={`${yearsExperience}+`}
                label="Years Exp"
                delay={0.3}
              />
              <QuickStat
                icon={HiCode}
                value={`${completedProjects}+`}
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
                    {["React", "Next.js", "TypeScript", "Node.js"].map(
                      (tech) => (
                        <Chip key={tech} variant="soft" size="sm">
                          {tech}
                        </Chip>
                      )
                    )}
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
