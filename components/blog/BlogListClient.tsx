"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { BlogCard } from "@/components/ui/BlogCard";
import { YearTimeline } from "@/components/ui/YearTimeline";
import { Pagination } from "@/components/ui/Pagination";
import type { BlogPost } from "@/lib/supabase/types";
import { FaFilter, FaTimes, FaNewspaper, FaStar, FaTags } from "react-icons/fa";

interface BlogListClientProps {
  posts: BlogPost[];
}

const ITEMS_PER_PAGE = 9;

/**
 * Client component for blog listing with:
 * - Year-based grouping and timeline navigation
 * - Tag filtering
 * - Pagination with smooth transitions
 * - Beautiful scroll animations
 */
export function BlogListClient({ posts }: BlogListClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get unique years from posts, sorted descending (newest first)
  const years = useMemo(() => {
    const yearSet = new Set<number>();
    posts.forEach((post) => {
      const date = post.published_at ? new Date(post.published_at) : new Date();
      yearSet.add(date.getFullYear());
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [posts]);

  // Get unique tags from all posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      (post.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Apply year filter
    if (activeYear) {
      result = result.filter((p) => {
        const date = p.published_at ? new Date(p.published_at) : new Date();
        return date.getFullYear() === activeYear;
      });
    }

    // Apply tag filter
    if (activeTag) {
      result = result.filter((p) => (p.tags || []).includes(activeTag));
    }

    // Sort by published_at descending (newest first)
    result.sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
      return dateB - dateA;
    });

    return result;
  }, [posts, activeYear, activeTag]);

  // Group posts by year for display
  const postsByYear = useMemo(() => {
    const grouped: Record<number, BlogPost[]> = {};
    filteredPosts.forEach((post) => {
      const date = post.published_at ? new Date(post.published_at) : new Date();
      const year = date.getFullYear();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(post);
    });
    return grouped;
  }, [filteredPosts]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeYear, activeTag]);

  // Handle year click from timeline
  const handleYearClick = (year: number) => {
    if (activeYear === year) {
      setActiveYear(null);
    } else {
      setActiveYear(year);
    }
  };

  // Handle tag click
  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null);
    } else {
      setActiveTag(tag);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveYear(null);
    setActiveTag(null);
  };

  const hasActiveFilters = activeYear !== null || activeTag !== null;

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
        className="mb-8 space-y-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Year pills (mobile alternative to timeline) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2 hidden sm:inline">Year:</span>
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
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
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
            className={`text-sm text-muted-foreground ${!hasActiveFilters ? 'ml-auto' : ''}`}
            key={filteredPosts.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
          </motion.span>
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2 flex items-center gap-1.5">
              <FaTags size={12} />
              Tags:
            </span>
            {allTags.slice(0, 10).map((tag) => (
              <motion.button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`
                  px-2.5 py-1 rounded-md text-xs font-medium
                  border transition-all duration-200
                  ${activeTag === tag
                    ? "bg-accent text-white border-accent"
                    : "bg-card/50 text-foreground/70 border-border/30 hover:border-accent/50 hover:text-foreground"
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
            {allTags.length > 10 && (
              <span className="text-xs text-muted-foreground">
                +{allTags.length - 10} more
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* Posts Grid */}
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
            {Object.entries(postsByYear)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, yearPosts]) => (
                <YearSection key={year} year={Number(year)} posts={yearPosts} />
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
                {paginatedPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
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
                    <BlogCard post={post} index={index} />
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
        {filteredPosts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <FaNewspaper className="text-accent/50" size={24} />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to see more posts.
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
function YearSection({ year, posts }: { year: number; posts: BlogPost[] }) {
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
          {/* Post count badge */}
          <motion.span
            className="px-3 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.5 }}
          >
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </motion.span>
        </motion.div>
      </div>

      {/* Posts grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <BlogCard post={post} index={index} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default BlogListClient;
