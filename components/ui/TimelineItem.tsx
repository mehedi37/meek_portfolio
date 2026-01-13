"use client";

import { motion } from "framer-motion";
import type { Experience } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";
import { FaBriefcase, FaMapMarkerAlt, FaCalendar } from "react-icons/fa";

interface TimelineItemProps {
  experience: Experience;
  index: number;
  isLeft?: boolean;
}

/**
 * Professional timeline item for experience section
 */
export function TimelineItem({ experience, index, isLeft = true }: TimelineItemProps) {
  const isCurrent = !experience.end_date;

  const formatDateRange = () => {
    const start = formatDate(experience.start_date, { month: "short", year: "numeric" });
    const end = isCurrent
      ? "Present"
      : experience.end_date
      ? formatDate(experience.end_date, { month: "short", year: "numeric" })
      : "";
    return `${start} - ${end}`;
  };

  return (
    <div className={`relative flex flex-col md:flex-row items-start gap-4 md:gap-8 ${
      isLeft ? "md:flex-row-reverse" : ""
    }`}>
      {/* Timeline dot */}
      <div className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 z-10">
        <motion.div
          className={`w-4 h-4 rounded-full border-4 border-background ${
            isCurrent ? "bg-accent" : "bg-muted-foreground/50"
          }`}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, type: "spring" }}
        />
        {isCurrent && (
          <motion.div
            className="absolute inset-0 rounded-full bg-accent"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Content card */}
      <motion.div
        className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${
          isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
        }`}
        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{experience.position}</h3>
              <span className="font-medium text-accent">{experience.company}</span>
            </div>
            {isCurrent && (
              <span className="flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full bg-accent/10 text-accent border border-accent/20">
                Current
              </span>
            )}
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <FaCalendar size={11} />
              {formatDateRange()}
            </span>
            {experience.location && (
              <span className="flex items-center gap-1.5">
                <FaMapMarkerAlt size={11} />
                {experience.location}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {experience.description}
          </p>

          {/* Technologies */}
          {experience.technologies && experience.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {experience.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-secondary/80 text-foreground/70"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default TimelineItem;
