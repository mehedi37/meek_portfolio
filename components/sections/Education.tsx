"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, Link } from "@heroui/react";
import type { Education as EducationType } from "@/lib/supabase/types";
import { HiAcademicCap, HiLocationMarker, HiCalendar, HiExternalLink } from "react-icons/hi";

interface EducationProps {
  className?: string;
  education?: EducationType[];
}

function EducationCard({ entry, index }: { entry: EducationType; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isCurrent = entry.is_current || !entry.end_date;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Present";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Card variant="default" className="p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            {entry.institution_logo ? (
              <img
                src={entry.institution_logo}
                alt={entry.institution}
                className="w-8 h-8 object-contain rounded"
              />
            ) : (
              <HiAcademicCap className="w-6 h-6 text-accent" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
              <h3 className="text-lg font-semibold text-foreground">
                {entry.degree}
                {entry.field_of_study ? `, ${entry.field_of_study}` : ""}
              </h3>
              {isCurrent && (
                <span className="px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full shrink-0">
                  In Progress
                </span>
              )}
            </div>

            {entry.institution_url ? (
              <Link
                href={entry.institution_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1"
              >
                {entry.institution}
                <HiExternalLink className="w-3 h-3" />
              </Link>
            ) : (
              <p className="text-sm font-medium text-muted-foreground">{entry.institution}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <HiCalendar className="w-3.5 h-3.5 text-accent/60" />
                {formatDate(entry.start_date)} — {formatDate(entry.end_date)}
              </span>
              {entry.location && (
                <span className="flex items-center gap-1.5">
                  <HiLocationMarker className="w-3.5 h-3.5 text-accent/60" />
                  {entry.location}
                </span>
              )}
              {entry.gpa && <span>GPA: {entry.gpa}</span>}
            </div>

            {entry.description && (
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {entry.description}
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/**
 * Education section - simple card list, not a full animated timeline
 * (typically 1-2 entries, a timeline would be visual overkill here)
 */
export function Education({ className = "", education = [] }: EducationProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  if (education.length === 0) return null;

  const sorted = [...education].sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  return (
    <section
      ref={sectionRef}
      id="education"
      className={`relative py-20 lg:py-28 overflow-hidden ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">Education</h2>
          <p className="text-base text-muted max-w-xl mx-auto text-balance">
            Academic background behind the engineering.
          </p>
        </motion.div>

        <div className="space-y-6">
          {sorted.map((entry, index) => (
            <EducationCard key={entry.id} entry={entry} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;
