"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Chip, Card, Separator } from "@heroui/react";
import { HiBriefcase, HiLocationMarker, HiCalendar, HiSparkles, HiDocumentText } from "react-icons/hi";
import type { Experience as ExperienceType } from "@/lib/supabase/types";

interface ExperienceProps {
  className?: string;
  experiences?: ExperienceType[];
}

// Timeline item component with HeroUI Card
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isCurrentRole = !experience.end_date;

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
      className="relative pl-8 md:pl-0 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
    >
      {/* Left side - Date (desktop) */}
      <div className="hidden md:flex md:flex-col md:items-end md:justify-start md:pt-2">
        <span className="text-sm font-medium text-accent">
          {formatDate(experience.start_date)}
        </span>
        <span className="text-sm text-muted">
          — {formatDate(experience.end_date)}
        </span>
      </div>

      {/* Center - Timeline line and dot */}
      <div className="absolute left-0 md:relative md:flex md:flex-col md:items-center">
        {/* Dot */}
        <motion.div
          className={`w-4 h-4 rounded-full border-2 z-10 ${
            isCurrentRole
              ? "bg-accent border-accent"
              : "bg-surface border-default"
          }`}
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.2 + 0.3, duration: 0.3, type: "spring" }}
        >
          {isCurrentRole && (
            <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-50" />
          )}
        </motion.div>

        {/* Line */}
        {!isLast && (
          <div className="w-px flex-1 bg-separator" />
        )}
      </div>

      {/* Right side - Content */}
      <div className="pb-12">
        {/* Mobile date */}
        <div className="md:hidden flex items-center gap-2 text-sm text-muted mb-3">
          <HiCalendar className="w-4 h-4" />
          <span>{formatDate(experience.start_date)} — {formatDate(experience.end_date)}</span>
        </div>

        {/* Card */}
        <Card variant="default" className="p-6 hover:scale-[1.02] transition-transform group">
          <Card.Content className="space-y-4 p-0">
            {/* Current role badge */}
            {isCurrentRole && (
              <Chip color="success" variant="soft" size="sm" className="gap-1">
                <HiSparkles className="w-3 h-3" />
                Current Role
              </Chip>
            )}

            {/* Position & Company */}
            <div>
              <h3 className="text-xl font-semibold mb-1 group-hover:text-accent transition-colors">
                {experience.position}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <HiBriefcase className="w-4 h-4 text-accent" />
                  {experience.company}
                </span>
                {experience.location && (
                  <span className="flex items-center gap-1.5">
                    <HiLocationMarker className="w-4 h-4 text-accent" />
                    {experience.location}
                  </span>
                )}
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
      </div>
    </motion.div>
  );
}

/**
 * Experience Section - Timeline with HeroUI Cards
 */
export function Experience({ className = "", experiences = [] }: ExperienceProps) {
  const hasExperiences = experiences.length > 0;

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
            {experiences.map((exp, index) => (
              <TimelineCard
                key={exp.id}
                experience={exp}
                index={index}
                isLast={index === experiences.length - 1}
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
