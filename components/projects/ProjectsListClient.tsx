"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { YearTimeline } from "@/components/ui/YearTimeline";
import { Pagination } from "@/components/ui/Pagination";
import { Container } from "@/components/layout/Container";
import type { Project } from "@/lib/supabase/types";
import { FaFilter, FaTimes, FaFolder, FaStar } from "react-icons/fa";

interface ProjectsListClientProps {
  projects: Project[];
}

const ITEMS_PER_PAGE = 9;

/**
 * Client component for projects listing with:
 * - Year-based grouping and timeline navigation
 * - Pagination with smooth transitions
 * - Filtering options
 * - Beautiful scroll animations
 */
export function ProjectsListClient({ projects }: ProjectsListClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get unique years from projects, sorted descending (newest first)
  const years = useMemo(() => {
    const yearSet = new Set<number>();
    projects.forEach((project) => {
      const date = project.created_at ? new Date(project.created_at) : new Date();
      yearSet.add(date.getFullYear());
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Apply featured filter
    if (filterFeatured) {
      result = result.filter((p) => p.featured);
    }

    // Apply year filter
    if (activeYear) {
      result = result.filter((p) => {
        const date = p.created_at ? new Date(p.created_at) : new Date();
        return date.getFullYear() === activeYear;
      });
    }

    // Sort by created_at descending (newest first)
    result.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    return result;
  }, [projects, filterFeatured, activeYear]);

  // Group projects by year for display
  const projectsByYear = useMemo(() => {
    const grouped: Record<number, Project[]> = {};
    filteredProjects.forEach((project) => {
      const date = project.created_at ? new Date(project.created_at) : new Date();
      const year = date.getFullYear();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(project);
    });
    return grouped;
  }, [filteredProjects]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterFeatured, activeYear]);

  // Handle year click from timeline
  const handleYearClick = (year: number) => {
    if (activeYear === year) {
      setActiveYear(null); // Toggle off if same year clicked
    } else {
      setActiveYear(year);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterFeatured(false);
    setActiveYear(null);
  };

  const hasActiveFilters = filterFeatured || activeYear !== null;

  return (
    <div ref={containerRef} className="relative">
      {/* Year Timeline (fixed position) */}
      <YearTimeline
        years={years}
        activeYear={activeYear}
        onYearClick={handleYearClick}
      />

      {/* Filters */}
      <motion.div
        className="mb-8 flex flex-wrap items-center gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Filter buttons */}
        <motion.button
          onClick={() => setFilterFeatured(!filterFeatured)}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            border transition-all duration-200
            ${filterFeatured
              ? "bg-accent text-white border-accent"
              : "bg-card/50 text-foreground border-border/50 hover:border-accent/50"
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaStar size={12} />
          Featured Only
        </motion.button>

        {/* Year pills (mobile alternative to timeline) */}
        <div className="flex flex-wrap gap-2 lg:hidden">
          {years.map((year) => (
            <motion.button
              key={year}
              onClick={() => handleYearClick(year)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium
                border transition-all duration-200
                ${activeYear === year
                  ? "bg-accent text-white border-accent"
                  : "bg-card/50 text-foreground border-border/50 hover:border-accent/50"
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {year}
            </motion.button>
          ))}
        </div>

        {/* Clear filters */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              <FaTimes size={10} />
              Clear filters
            </motion.button>
          )}
        </AnimatePresence>

        {/* Results count */}
        <motion.span
          className="ml-auto text-sm text-muted-foreground"
          key={filteredProjects.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
        </motion.span>
      </motion.div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        {activeYear ? (
          // Grouped by year view when year is selected
          <motion.div
            key="year-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {Object.entries(projectsByYear)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, yearProjects]) => (
                <YearSection key={year} year={Number(year)} projects={yearProjects} />
              ))}
          </motion.div>
        ) : (
          // Regular paginated view
          <motion.div
            key="paginated-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <AnimatePresence mode="popLayout">
                {paginatedProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: { delay: index * 0.05 }
                    }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <ProjectCard project={project} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    // Scroll to top of container
                    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      <AnimatePresence>
        {filteredProjects.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <FaFolder className="text-accent/50" size={24} />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to see more projects.
            </p>
            <motion.button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTimes size={12} />
              Clear all filters
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Year section component with animated header
 */
function YearSection({ year, projects }: { year: number; projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="mb-12"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Year header */}
      <div className="relative mb-8">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ delay: 0.2 }}
        >
          {/* Large year number */}
          <span className="text-6xl sm:text-7xl font-bold bg-gradient-to-br from-accent to-accent/50 bg-clip-text text-transparent">
            {year}
          </span>
          {/* Decorative line */}
          <motion.div
            className="flex-1 h-0.5 bg-gradient-to-r from-accent/50 to-transparent rounded-full"
            initial={{ scaleX: 0, originX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          />
          {/* Project count badge */}
          <motion.span
            className="px-3 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.5 }}
          >
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </motion.span>
        </motion.div>
      </div>

      {/* Projects grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <ProjectCard project={project} index={index} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default ProjectsListClient;
