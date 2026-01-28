"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Chip, Card, Separator, Link } from "@heroui/react";
import { HiBriefcase, HiLocationMarker, HiCalendar, HiSparkles, HiDocumentText, HiExternalLink } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";
import type { Experience as ExperienceType } from "@/lib/supabase/types";
import Image from "next/image";

interface ExperienceProps {
  className?: string;
  experiences?: ExperienceType[];
}

// Character limit for truncation
const DESCRIPTION_LIMIT = 150;

// Timeline item component with HeroUI Card - Cards on right side of timeline
function TimelineCard({
  experience,
  index,
  isLast
}: {
  experience: ExperienceType;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isCurrentRole = experience.is_current || !experience.end_date;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Present";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  };

  // Calculate duration
  const getDuration = () => {
    const start = new Date(experience.start_date);
    const end = experience.end_date ? new Date(experience.end_date) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) return `${remainingMonths} mo`;
    if (remainingMonths === 0) return `${years} yr`;
    return `${years} yr ${remainingMonths} mo`;
  };

  return (
    <motion.div
      ref={ref}
      className="relative pl-10 md:pl-0 md:grid md:grid-cols-[180px_auto_1fr] md:gap-6 lg:grid-cols-[200px_auto_1fr] lg:gap-8"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Left side - Date (desktop) */}
      <div className="hidden md:flex md:flex-col md:items-end md:justify-start md:pt-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: index * 0.12 + 0.15, duration: 0.4 }}
          className="text-right space-y-1"
        >
          <span className="text-sm font-semibold text-accent block">
            {formatDate(experience.start_date)}
          </span>
          <span className="text-xs text-muted block">
            {formatDate(experience.end_date)}
          </span>
          <span className="text-[10px] text-muted/70 block mt-1.5 font-medium">
            {getDuration()}
          </span>
        </motion.div>
      </div>

      {/* Center - Timeline line and dot */}
      <div className="absolute left-0 md:relative md:flex md:flex-col md:items-center">
        {/* Dot with enhanced styling */}
        <motion.div
          className="relative mt-6"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.12 + 0.2, duration: 0.35, type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Outer glow ring */}
          <motion.span
            className={`absolute -inset-1.5 rounded-full ${
              isCurrentRole ? "bg-accent/30" : "bg-separator/20"
            } blur-sm`}
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.15,
            }}
          />

          <div
            className={`relative w-4 h-4 rounded-full border-[2.5px] z-10 transition-all duration-300 ${
              isCurrentRole
                ? "bg-accent border-accent shadow-lg shadow-accent/40"
                : "bg-surface border-separator hover:border-accent/50"
            }`}
          >
            {isCurrentRole && (
              <>
                {/* Pulse rings for current role */}
                <motion.span
                  className="absolute inset-0 rounded-full bg-accent"
                  animate={{
                    scale: [1, 2, 2],
                    opacity: [0.5, 0, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
                <motion.span
                  className="absolute inset-0 rounded-full bg-accent"
                  animate={{
                    scale: [1, 1.6, 1.6],
                    opacity: [0.3, 0, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 0.4,
                    ease: "easeOut"
                  }}
                />
                {/* Inner glow */}
                <span className="absolute inset-0.5 rounded-full bg-white/40" />
              </>
            )}
          </div>
        </motion.div>

        {/* Animated Line with Light Trail */}
        {!isLast && (
          <div className="relative w-0.5 flex-1 overflow-hidden min-h-28 rounded-full">
            {/* Base line with gradient */}
            <motion.div
              className="absolute inset-0 bg-linear-to-b from-separator via-separator/50 to-separator/20 rounded-full"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ delay: index * 0.12 + 0.35, duration: 0.6, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
            />

            {/* Light trail effect */}
            <motion.div
              className="absolute w-full h-16"
              initial={{ bottom: "-10%" }}
              animate={isInView ? {
                bottom: ["0%", "115%"],
              } : {}}
              transition={{
                delay: index * 0.12 + 0.8,
                duration: 2,
                repeat: Infinity,
                repeatDelay: 2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Soft glow */}
              <div className="absolute inset-x-0 h-full bg-linear-to-t from-transparent via-accent/50 to-transparent blur-md" />
              {/* Core light */}
              <div className="absolute inset-x-0 h-full bg-linear-to-t from-transparent via-accent/80 to-transparent blur-[2px]" />
              {/* Sharp center */}
              <div className="absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 bg-accent rounded-full blur-[1px]" />
            </motion.div>

            {/* Sparkle particles */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 w-1 h-1 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_6px_2px] shadow-accent/60"
                initial={{ bottom: "-5%", opacity: 0, scale: 0.5 }}
                animate={isInView ? {
                  bottom: ["0%", "120%"],
                  opacity: [0, 1, 1, 0],
                  scale: [0.4, 1, 0.8, 0.3],
                } : {}}
                transition={{
                  delay: index * 0.12 + 1 + i * 0.2,
                  duration: 1.8,
                  repeat: Infinity,
                  repeatDelay: 3.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right side - Card content */}
      <motion.div
        className="pb-10"
        initial={{ opacity: 0, x: -15 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: index * 0.12 + 0.25, duration: 0.45 }}
      >
        {/* Mobile date badge */}
        <div className="md:hidden flex items-center gap-2 text-xs text-muted mb-3 bg-surface/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-separator/40 w-fit">
          <HiCalendar className="w-3.5 h-3.5 text-accent" />
          <span className="font-medium">{formatDate(experience.start_date)} — {formatDate(experience.end_date)}</span>
          <span className="text-muted/60">· {getDuration()}</span>
        </div>

        <ExperienceCard experience={experience} isCurrentRole={isCurrentRole} />
      </motion.div>
    </motion.div>
  );
}

// Experience Card component with expandable description
function ExperienceCard({ experience, isCurrentRole }: { experience: ExperienceType; isCurrentRole: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionLength = experience.description?.length || 0;
  const shouldTruncate = descriptionLength > DESCRIPTION_LIMIT;

  const displayDescription = shouldTruncate && !isExpanded
    ? experience.description.substring(0, DESCRIPTION_LIMIT).trim() + "..."
    : experience.description;

  return (
    <Card
      variant="default"
      className="group relative overflow-hidden border border-separator/40 hover:border-accent/30 bg-surface/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-accent/5"
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-accent/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <Card.Content className="relative p-5 space-y-4">
        {/* Header: Logo + Info */}
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          {experience.company_logo && (
            <motion.div
              className="relative w-14 h-14 rounded-xl overflow-hidden bg-surface-secondary shrink-0 border border-separator/30 group-hover:border-accent/30 transition-colors shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src={experience.company_logo}
                alt={`${experience.company} logo`}
                fill
                className="object-contain p-2"
              />
            </motion.div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* Position title */}
            <h3 className="text-lg font-bold leading-tight group-hover:text-accent transition-colors">
              {experience.position}
            </h3>

            {/* Company & Location */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <HiBriefcase className="w-3.5 h-3.5 text-accent/70" />
                {experience.company_url ? (
                  <Link
                    href={experience.company_url}
                    target="_blank"
                    className="font-medium hover:text-accent transition-colors inline-flex items-center gap-1"
                  >
                    {experience.company}
                    <HiExternalLink className="w-3 h-3 opacity-60" />
                  </Link>
                ) : (
                  <span className="font-medium">{experience.company}</span>
                )}
              </span>
              {experience.location && (
                <span className="flex items-center gap-1">
                  <HiLocationMarker className="w-3.5 h-3.5 text-accent/70" />
                  <span>{experience.location}</span>
                </span>
              )}
            </div>
          </div>

          {/* Current role badge */}
          {isCurrentRole && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="shrink-0"
            >
              <Chip color="success" variant="soft" size="sm" className="gap-1 font-medium">
                <HiSparkles className="w-3 h-3" />
                Current
              </Chip>
            </motion.div>
          )}
        </div>

        <Separator className="opacity-40" />

        {/* Description with expand/collapse */}
        <div className="space-y-1.5">
          <AnimatePresence mode="wait">
            <motion.p
              key={isExpanded ? "expanded" : "collapsed"}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.15 }}
              className="text-muted text-sm leading-relaxed"
            >
              {displayDescription}
            </motion.p>
          </AnimatePresence>

          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors group/btn cursor-pointer"
            >
              <span>{isExpanded ? "Show less" : "See more"}</span>
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiChevronDown className="w-3 h-3" />
              </motion.span>
            </button>
          )}
        </div>

        {/* Technologies */}
        {experience.technologies && experience.technologies.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-1.5 pt-1"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.03 } }
            }}
          >
            {experience.technologies.map((tech, idx) => (
              <motion.div
                key={tech}
                variants={{
                  hidden: { scale: 0.9, opacity: 0 },
                  visible: { scale: 1, opacity: 1 }
                }}
              >
                <Chip
                  variant="soft"
                  size="sm"
                  className="text-xs hover:bg-accent/10 transition-colors cursor-default"
                >
                  {tech}
                </Chip>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Card.Content>
    </Card>
  );
}

/**
 * Experience Section - Professional Timeline with HeroUI Cards
 * Features: Animated dots, light trails, cards on right side
 */
export function Experience({ className = "", experiences = [] }: ExperienceProps) {
  // Sort experiences: current roles first, then by start_date descending
  const sortedExperiences = [...experiences].sort((a, b) => {
    const aIsCurrent = a.is_current || !a.end_date;
    const bIsCurrent = b.is_current || !b.end_date;
    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
  });

  const hasExperiences = sortedExperiences.length > 0;

  return (
    <section id="experience" className={`relative py-20 lg:py-28 overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-accent/2 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <Chip color="accent" variant="soft" className="mb-5 gap-1.5">
            <HiBriefcase className="w-3.5 h-3.5" />
            Experience
          </Chip>
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">
            Professional Journey
          </h2>
          <p className="text-base text-muted max-w-xl mx-auto text-balance">
            A timeline of my career growth and the impact I&apos;ve made along the way.
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
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            className="text-center py-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card variant="secondary" className="max-w-sm mx-auto">
              <Card.Content className="py-10 px-8 space-y-3 text-center">
                <div className="w-14 h-14 rounded-full bg-surface-secondary flex items-center justify-center mx-auto mb-4">
                  <HiDocumentText className="w-7 h-7 text-muted" />
                </div>
                <Card.Title className="text-lg">No Experience Added Yet</Card.Title>
                <Card.Description>
                  Experience entries will appear here once added.
                </Card.Description>
              </Card.Content>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}
