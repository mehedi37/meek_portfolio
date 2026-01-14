"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { Button, Chip, Card } from "@heroui/react";
import { FaGithub, FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";
import { HiSparkles, HiCode, HiEye, HiPhotograph } from "react-icons/hi";
import type { Project } from "@/lib/supabase/types";

interface ProjectsProps {
  className?: string;
  projects?: Project[];
}

// Project card with HeroUI Card component
function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      ref={ref}
      className={`group relative ${featured ? "lg:col-span-2" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/projects/${project.slug}`}>
        <Card
          variant="default"
          className="overflow-hidden h-full hover:scale-[1.02] transition-transform duration-300"
        >
          {/* Image Container */}
          <div
            className={`relative ${
              featured ? "h-72 lg:h-80" : "h-56"
            } overflow-hidden`}
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent z-10 opacity-80" />

            {/* Image */}
            <motion.div
              className="absolute inset-0"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <img
                src={
                  project.image ||
                  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop"
                }
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Featured badge */}
            {project.featured && (
              <div className="absolute top-4 left-4 z-20">
                <Chip
                  color="accent"
                  variant="primary"
                  size="sm"
                  className="gap-1"
                >
                  <HiSparkles className="w-3 h-3" />
                  Featured
                </Chip>
              </div>
            )}

            {/* Hover overlay with actions */}
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-background/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="flex gap-3"
                initial={{ y: 20 }}
                animate={{ y: isHovered ? 0 : 20 }}
                transition={{ duration: 0.3 }}
              >
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-12 h-12 rounded-full bg-surface flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                    aria-label="View live site"
                  >
                    <HiEye className="w-5 h-5" />
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-12 h-12 rounded-full bg-surface flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                    aria-label="View source code"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Content */}
          <Card.Content className="p-6 space-y-4">
            <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
              {project.title}
            </h3>

            <p className="text-muted text-sm line-clamp-2">
              {project.description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2">
              {project.tech_stack?.slice(0, 4).map((tech) => (
                <Chip key={tech} variant="soft" size="sm">
                  {tech}
                </Chip>
              ))}
              {project.tech_stack && project.tech_stack.length > 4 && (
                <Chip variant="soft" size="sm">
                  +{project.tech_stack.length - 4}
                </Chip>
              )}
            </div>

            {/* View project link */}
            <motion.div
              className="flex items-center gap-2 text-sm font-medium text-accent pt-2"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <span>View Project</span>
              <FaArrowRight className="w-3 h-3" />
            </motion.div>
          </Card.Content>
        </Card>
      </Link>
    </motion.article>
  );
}

/**
 * Projects Section - Bento-style grid layout
 * Uses HeroUI v3 Card components
 */
export function Projects({ className = "", projects = [] }: ProjectsProps) {
  const [filter, setFilter] = useState<"all" | "featured">("all");

  const filteredProjects =
    filter === "featured" ? projects.filter((p) => p.featured) : projects;

  const hasProjects = projects.length > 0;

  return (
    <section
      id="projects"
      className={`relative py-24 lg:py-32 overflow-hidden ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Chip color="accent" variant="soft" className="mb-6 gap-2">
            <HiCode className="w-4 h-4" />
            Featured Work
          </Chip>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Projects I&apos;ve Built
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto text-balance">
            A selection of projects that showcase my skills and passion for
            building great products.
          </p>
        </motion.div>

        {hasProjects ? (
          <>
            {/* Filter buttons */}
            <motion.div
              className="flex justify-center gap-3 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Button
                variant={filter === "all" ? "primary" : "ghost"}
                size="sm"
                onPress={() => setFilter("all")}
              >
                All Projects
              </Button>
              <Button
                variant={filter === "featured" ? "primary" : "ghost"}
                size="sm"
                onPress={() => setFilter("featured")}
              >
                <HiSparkles className="w-4 h-4 mr-1" />
                Featured
              </Button>
            </motion.div>

            {/* Projects Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  featured={project.featured === true && index === 0}
                />
              ))}
            </div>

            {/* View All Projects CTA */}
            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link href="/projects">
                <Button variant="secondary" size="lg" className="group">
                  View All Projects
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </>
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
                <HiPhotograph className="w-16 h-16 mx-auto text-muted" />
                <h3 className="text-xl font-semibold">No Projects Yet</h3>
                <p className="text-muted">
                  Projects will appear here once added through the admin
                  dashboard.
                </p>
              </Card.Content>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}
