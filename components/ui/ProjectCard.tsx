"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/lib/supabase/types";
import { FaGithub, FaExternalLinkAlt, FaStar } from "react-icons/fa";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

/**
 * Professional project card with image, details, and hover effects
 * Uses Tailwind styling for consistency
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
        {/* Image */}
        <Link href={`/projects/${project.slug}`} className="block relative">
          <div className="relative h-48 overflow-hidden">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
                <span className="text-4xl font-bold text-accent/20">
                  {project.title.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

            {/* Featured badge */}
            {project.featured && (
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-accent text-white rounded-full shadow-lg">
                  <FaStar size={10} />
                  Featured
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <Link href={`/projects/${project.slug}`}>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-200 line-clamp-1">
                {project.title}
              </h3>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5">
            {(project.tech_stack || []).slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-secondary/80 text-foreground/70"
              >
                {tech}
              </span>
            ))}
            {(project.tech_stack || []).length > 4 && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-secondary/80 text-foreground/70">
                +{(project.tech_stack || []).length - 4}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {project.live_url && (
              <motion.a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
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
                Source
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ProjectCard;
