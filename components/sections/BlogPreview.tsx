"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Card, Chip, Button } from "@heroui/react";
import { FaArrowRight, FaPen, FaClock } from "react-icons/fa";
import { HiSparkles, HiDocumentText } from "react-icons/hi";
import type { BlogPost } from "@/lib/supabase/types";

interface BlogPreviewProps {
  className?: string;
  posts?: BlogPost[];
  limit?: number;
}

// Blog card component using HeroUI Card
function BlogPostCard({ post, index }: { post: BlogPost; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Unknown date";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card variant="default" className="h-full overflow-hidden hover:scale-[1.02] transition-transform group">
          {/* Image */}
          {post.cover_image && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent" />
            </div>
          )}

          <Card.Content className="p-6 space-y-4">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <Chip key={tag} variant="soft" size="sm" color="accent">
                    {tag}
                  </Chip>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-accent transition-colors">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-muted line-clamp-2">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-muted pt-2">
              <span>{formatDate(post.published_at || post.created_at)}</span>
              <span className="flex items-center gap-1">
                <FaClock className="w-3 h-3" />
                {post.reading_time} min read
              </span>
            </div>
          </Card.Content>
        </Card>
      </Link>
    </motion.article>
  );
}

/**
 * Blog Preview Section - Latest articles with HeroUI Cards
 */
export function BlogPreview({
  className = "",
  posts = [],
  limit = 3,
}: BlogPreviewProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const displayPosts = posts.slice(0, limit);
  const hasPosts = displayPosts.length > 0;

  return (
    <section
      ref={sectionRef}
      id="blog"
      className={`relative py-24 lg:py-32 overflow-hidden ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Chip color="accent" variant="soft" className="mb-6 gap-2">
            <FaPen className="w-3 h-3" />
            Blog
          </Chip>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Latest Articles
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto text-balance">
            Thoughts, tutorials, and insights on web development, design,
            and technology. Sharing what I learn along the way.
          </p>
        </motion.div>

        {hasPosts ? (
          <>
            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {displayPosts.map((post, index) => (
                <BlogPostCard key={post.slug} post={post} index={index} />
              ))}
            </div>

            {/* View All Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link href="/blog">
                <Button
                  variant="secondary"
                  size="lg"
                  className="group"
                >
                  View All Posts
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
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            <Card variant="secondary" className="max-w-md mx-auto p-12">
              <Card.Content className="space-y-4 p-0">
                <HiDocumentText className="w-16 h-16 mx-auto text-muted" />
                <h3 className="text-xl font-semibold">No Blog Posts Yet</h3>
                <p className="text-muted">
                  Blog posts will appear here once published through the admin dashboard.
                </p>
              </Card.Content>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default BlogPreview;
