"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { FaClock, FaArrowRight, FaCalendar } from "react-icons/fa";
import type { BlogPost } from "@/lib/supabase/types";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

/**
 * Blog post card with image, metadata, and hover effects
 * Links to full blog post page
 * Uses Supabase BlogPost type with snake_case field names
 */
export function BlogCard({ post, index = 0 }: BlogCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link 
        href={`/blog/${post.slug}`}
        className="block h-full bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden group hover:border-accent/30 transition-all duration-300"
      >
        {/* Image */}
        {post.cover_image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
            
            {/* Tags overlay */}
            {post.tags && post.tags.length > 0 && (
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs font-medium rounded-md bg-background/80 backdrop-blur-sm text-foreground/80"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 2 && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-background/80 backdrop-blur-sm text-foreground/80">
                    +{post.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <FaCalendar size={10} className="text-accent/60" />
                {formatDate(post.published_at, { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
            {post.reading_time && (
              <>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5">
                  <FaClock size={10} className="text-accent/60" />
                  {post.reading_time} min read
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Read more link */}
          <div className="flex items-center gap-2 text-sm font-medium text-accent">
            <span>Read article</span>
            <FaArrowRight 
              size={12} 
              className="group-hover:translate-x-1 transition-transform duration-200" 
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default BlogCard;
