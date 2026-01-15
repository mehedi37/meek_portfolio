"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Button, Chip, Card } from "@heroui/react";
import { FaArrowRight } from "react-icons/fa";
import { HiCode, HiDocumentText } from "react-icons/hi";
import type { Project } from "@/lib/supabase/types";
import { ProjectCard } from "@/components/ui/ProjectCard";

interface ProjectsProps {
  className?: string;
  projects?: Project[];
}

/**
 * Projects Section - Showcase featured projects using common ProjectCard
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
                variant={filter === "all" ? "primary" : "secondary"}
                size="md"
                onPress={() => setFilter("all")}
              >
                All Projects
              </Button>
              <Button
                variant={filter === "featured" ? "primary" : "secondary"}
                size="md"
                onPress={() => setFilter("featured")}
              >
                Featured
              </Button>
            </motion.div>

            {/* Projects Grid - Using common ProjectCard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.slice(0, 6).map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
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
                <Button variant="secondary" size="lg">
                  View All Projects <FaArrowRight className="ml-2" />
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
                <HiDocumentText className="w-16 h-16 mx-auto text-muted" />
                <h3 className="text-xl font-semibold">No Projects Yet</h3>
                <p className="text-muted">
                  Projects will appear here once added through the admin dashboard.
                </p>
              </Card.Content>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Projects;
