"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/lib/supabase/types";
import { MediaThumbnail } from "./MediaDisplay";
import { FaGithub, FaExternalLinkAlt, FaStar, FaCalendar } from "react-icons/fa";
import { Chip } from '@heroui/react';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

// Format date for display
function formatProjectDate(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const startStr = start.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  if (!endDate) {
    return `${startStr} - Present`;
  }

  const end = new Date(endDate);
  const endStr = end.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return `${startStr} - ${endStr}`;
}

/**
 * Modern project card with image/video support
 * Features hover effects and action buttons
 * Media section: Hover-to-play video
 * Content section: Click to navigate to details
 */
export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.article
      className="group relative h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="h-full rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-300 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5">
        {/* Media (Image/Video) - Hover to play */}
        <div className="block relative">
          <MediaThumbnail
            image={project.image}
            videoUrl={project.video_url}
            alt={project.title}
            className="h-48"
          />

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-accent text-white rounded-full shadow-lg">
                <FaStar size={10} />
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content - Click to navigate */}
        <Link href={`/projects/${project.slug}`}>
          <div className="p-5 space-y-4 cursor-pointer">
            <div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-200 line-clamp-1">
                {project.title}
              </h3>
              {/* Project Timeline */}
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                <FaCalendar size={10} />
                <span>{formatProjectDate(project.start_date, project.end_date)}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5">
              {(project.tech_stack || []).slice(0, 4).map((tech) => (
                <Chip
                  key={tech}
                  size="md"
                  variant="soft"
                  color="success"
                >
                  {tech}
                </Chip>
              ))}
              {(project.tech_stack || []).length > 4 && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-secondary/80 text-foreground/70">
                  +{(project.tech_stack || []).length - 4}
                </span>
              )}
            </div>

            {/* View Details indicator */}
            <div className="flex items-center gap-2 text-sm font-medium text-accent pt-2">
              <span>View Details</span>
              <span>→</span>
            </div>
          </div>
        </Link>

        {/* External Actions - Outside Link */}
        {(project.live_url || project.github_url) && (
          <div className="px-5 pb-4 flex items-center gap-3">
            {project.live_url && (
              <motion.a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                whileHover={{ x: 2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt size={12} />
                Live Demo
              </motion.a>
            )}
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                whileHover={{ x: 2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <FaGithub size={14} />
                Source Code
              </motion.a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default ProjectCard;
