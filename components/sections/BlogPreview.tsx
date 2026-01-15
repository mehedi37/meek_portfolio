"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Card, Chip, Button } from "@heroui/react";
import { FaArrowRight, FaPen } from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi";
import type { BlogPost } from "@/lib/supabase/types";
import { BlogCard } from "@/components/ui/BlogCard";

interface BlogPreviewProps {
  className?: string;
  posts?: BlogPost[];
  limit?: number;
}

/**
 * Blog Preview Section - Latest articles using common BlogCard
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
            {/* Blog Grid - Using common BlogCard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {displayPosts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
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
