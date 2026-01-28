"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Chip, Card, Separator, Link } from "@heroui/react";
import { HiBriefcase, HiLocationMarker, HiCalendar, HiSparkles, HiDocumentText, HiExternalLink } from "react-icons/hi";
import type { Experience as ExperienceType } from "@/lib/supabase/types";
import Image from "next/image";

interface ExperienceProps {
  className?: string;
  experiences?: ExperienceType[];
}

// Timeline item component with HeroUI Card - Zig-zag layout for large screens
function TimelineCard({
  experience,
  index,
  isLast,
  isEven
}: {
  experience: ExperienceType;
  index: number;
  isLast: boolean;
  isEven: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isCurrentRole = experience.is_current || !experience.end_date;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Present";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  };

  return (
    <motion.div
      ref={ref}
      className={`relative pl-8 lg:pl-0 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8 ${isEven ? "" : "lg:direction-rtl"}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
      style={{ direction: "ltr" }}
    >
      {/* Left side - Date (desktop) or Content for odd items */}
      <div className={`hidden lg:flex lg:flex-col ${isEven ? "lg:items-end lg:justify-start" : "lg:items-start lg:order-3"} lg:pt-2`}>
        {isEven ? (
          <>
            <span className="text-sm font-medium text-accent">
              {formatDate(experience.start_date)}
            </span>
            <span className="text-sm text-muted">
              — {formatDate(experience.end_date)}
            </span>
          </>
        ) : (
          <ExperienceContent experience={experience} isCurrentRole={isCurrentRole} />
        )}
      </div>

      {/* Center - Timeline line and dot */}
      <div className="absolute left-0 lg:relative lg:flex lg:flex-col lg:items-center lg:order-2">
        {/* Dot */}
        <motion.div
          className={`relative w-4 h-4 rounded-full border-2 z-10 ${
            isCurrentRole
              ? "bg-accent border-accent"
              : "bg-surface border-default"
          }`}
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.2 + 0.3, duration: 0.3, type: "spring" }}
        >
          {isCurrentRole && (
            <>
              <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-50" />
              <span className="absolute inset-[-4px] rounded-full bg-accent/30 animate-pulse" />
            </>
          )}

          {/* Glowing pulse effect */}
          <motion.span
            className="absolute inset-[-6px] rounded-full bg-accent/20 blur-md"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        </motion.div>

        {/* Animated Line with Light Trail */}
        {!isLast && (
          <div className="relative w-px flex-1 overflow-hidden min-h-[100px]">
            {/* Base line */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-separator via-separator/50 to-separator"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
              style={{ transformOrigin: "top" }}
            />

            {/* Main light trail - moving from bottom to top */}
            <motion.div
              className="absolute w-full h-16"
              initial={{ bottom: "-20%" }}
              animate={isInView ? {
                bottom: ["0%", "120%"],
              } : {}}
              transition={{
                delay: index * 0.2 + 1,
                duration: 1.8,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
              }}
            >
              {/* Core glow */}
              <div className="absolute inset-x-0 h-full bg-gradient-to-t from-transparent via-accent/80 to-transparent blur-sm" />
              {/* Bright center */}
              <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-accent rounded-full blur-[2px]" />
            </motion.div>

            {/* Trailing sparkle particles */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_6px_2px_rgba(var(--accent-rgb),0.6)]"
                initial={{ bottom: "-5%", opacity: 0 }}
                animate={isInView ? {
                  bottom: ["0%", "110%"],
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1, 1, 0.3],
                } : {}}
                transition={{
                  delay: index * 0.2 + 1.2 + i * 0.15,
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2.3,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right side - Content for even items, Date for odd items */}
      <div className={`pb-12 ${isEven ? "lg:order-3" : "lg:order-1 lg:flex lg:flex-col lg:items-end"}`}>
        {/* Mobile date */}
        <div className="lg:hidden flex items-center gap-2 text-sm text-muted mb-3">
          <HiCalendar className="w-4 h-4" />
          <span>{formatDate(experience.start_date)} — {formatDate(experience.end_date)}</span>
        </div>

        {isEven ? (
          <ExperienceContent experience={experience} isCurrentRole={isCurrentRole} />
        ) : (
          <div className="hidden lg:block">
            <span className="text-sm font-medium text-accent">
              {formatDate(experience.start_date)}
            </span>
            <span className="text-sm text-muted">
              {" "}— {formatDate(experience.end_date)}
            </span>
          </div>
        )}

        {/* Mobile: Always show content */}
        <div className="lg:hidden">
          <ExperienceContent experience={experience} isCurrentRole={isCurrentRole} />
        </div>
      </div>
    </motion.div>
  );
}

// Extracted content component for reuse
function ExperienceContent({ experience, isCurrentRole }: { experience: ExperienceType; isCurrentRole: boolean }) {
  return (
    <Card variant="default" className="p-6 hover:scale-[1.02] transition-transform group w-full">
      <Card.Content className="space-y-4 p-0">
        {/* Current role badge */}
        {isCurrentRole && (
          <Chip color="success" variant="soft" size="sm" className="gap-1">
            <HiSparkles className="w-3 h-3" />
            Current Role
          </Chip>
        )}

        {/* Company Logo & Info */}
        <div className="flex items-start gap-4">
          {experience.company_logo && (
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-default/50 flex-shrink-0 border border-separator">
              <Image
                src={experience.company_logo}
                alt={`${experience.company} logo`}
                fill
                className="object-contain p-2"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold mb-1 group-hover:text-accent transition-colors">
              {experience.position}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <HiBriefcase className="w-4 h-4 text-accent" />
                {experience.company_url ? (
                  <Link
                    href={experience.company_url}
                    target="_blank"
                    className="hover:text-accent transition-colors inline-flex items-center gap-1"
                  >
                    {experience.company}
                    <HiExternalLink className="w-3 h-3" />
                  </Link>
                ) : (
                  experience.company
                )}
              </span>
              {experience.location && (
                <span className="flex items-center gap-1.5">
                  <HiLocationMarker className="w-4 h-4 text-accent" />
                  {experience.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <p className="text-muted text-sm leading-relaxed">
          {experience.description}
        </p>

        {/* Technologies */}
        {experience.technologies && experience.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech) => (
              <Chip key={tech} variant="soft" size="sm">
                {tech}
              </Chip>
            ))}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}

/**
 * Experience Section - Timeline with HeroUI Cards (Zig-zag layout)
 * Current roles are always shown first
 */
export function Experience({ className = "", experiences = [] }: ExperienceProps) {
  // Sort experiences: current roles first, then by start_date descending
  const sortedExperiences = [...experiences].sort((a, b) => {
    // Current roles first
    const aIsCurrent = a.is_current || !a.end_date;
    const bIsCurrent = b.is_current || !b.end_date;
    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;
    // Then by start_date descending
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
  });

  const hasExperiences = sortedExperiences.length > 0;

  return (
    <section id="experience" className={`relative py-24 lg:py-32 overflow-hidden ${className}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Chip color="accent" variant="soft" className="mb-6 gap-2">
            <HiBriefcase className="w-4 h-4" />
            Experience
          </Chip>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Professional Journey
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto text-balance">
            A timeline of my career growth, key achievements, and the impact I&apos;ve made.
          </p>
        </motion.div>

        {hasExperiences ? (
          /* Timeline */
          <div className="relative">
            {sortedExperiences.map((exp, index) => (
              <TimelineCard
                key={exp.id}
                experience={exp}
                index={index}
                isLast={index === sortedExperiences.length - 1}
                isEven={index % 2 === 0}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card variant="secondary" className="max-w-md mx-auto p-12">
              <Card.Content className="space-y-4 p-0">
                <HiDocumentText className="w-16 h-16 mx-auto text-muted" />
                <h3 className="text-xl font-semibold">No Experience Added Yet</h3>
                <p className="text-muted">
                  Experience entries will appear here once added through the admin dashboard.
                </p>
              </Card.Content>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}
