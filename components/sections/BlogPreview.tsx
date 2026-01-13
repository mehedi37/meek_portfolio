"use client";

import { motion } from "framer-motion";
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/animations";
import { BlogCard } from "@/components/ui/BlogCard";
import type { BlogPost } from "@/lib/supabase/types";
import { FaArrowRight, FaPen } from "react-icons/fa";
import Link from "next/link";

// Demo blog posts using Supabase BlogPost type with snake_case field names
// In production, fetch from Supabase using: supabase.from('blog_posts').select('*')
const DEMO_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "building-scalable-react-apps",
    title: "Building Scalable React Applications with Modern Architecture",
    excerpt: "Learn how to structure large React applications using modern patterns like feature-based architecture, custom hooks, and state management.",
    content: "",
    cover_image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    tags: ["React", "Architecture", "TypeScript"],
    author: "Your Name",
    published_at: "2024-06-15T00:00:00.000Z",
    reading_time: 8,
    published: true,
    created_at: "2024-06-15T00:00:00.000Z",
    updated_at: null,
  },
  {
    id: "2",
    slug: "mastering-typescript-generics",
    title: "Mastering TypeScript Generics: A Practical Guide",
    excerpt: "Deep dive into TypeScript generics with real-world examples. Learn how to write reusable, type-safe code that scales.",
    content: "",
    cover_image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    tags: ["TypeScript", "JavaScript", "Tutorial"],
    author: "Your Name",
    published_at: "2024-05-28T00:00:00.000Z",
    reading_time: 12,
    published: true,
    created_at: "2024-05-28T00:00:00.000Z",
    updated_at: null,
  },
  {
    id: "3",
    slug: "nextjs-performance-optimization",
    title: "Next.js Performance Optimization: From Good to Great",
    excerpt: "Practical tips and techniques to optimize your Next.js application for speed, SEO, and user experience.",
    content: "",
    cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    tags: ["Next.js", "Performance", "Web Development"],
    author: "Your Name",
    published_at: "2024-05-10T00:00:00.000Z",
    reading_time: 10,
    published: true,
    created_at: "2024-05-10T00:00:00.000Z",
    updated_at: null,
  },
];

interface BlogPreviewProps {
  className?: string;
  posts?: BlogPost[];
  limit?: number;
}

/**
 * Blog preview section showing latest posts
 * Links to full blog page for more content
 */
export function BlogPreview({
  className = "",
  posts = DEMO_POSTS,
  limit = 3,
}: BlogPreviewProps) {
  const displayPosts = posts.slice(0, limit);

  return (
    <section
      id="blog"
      className={`relative py-20 lg:py-32 ${className}`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-16">
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20 mb-6"
          >
            <FaPen size={12} />
            Blog
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Latest{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              Articles
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Thoughts, tutorials, and insights on web development, design,
            and technology. Sharing what I learn along the way.
          </p>
        </FadeInSection>

        {/* Blog Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {displayPosts.map((post, index) => (
            <StaggerItem key={post.slug}>
              <BlogCard post={post} index={index} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View All Button */}
        <FadeInSection delay={0.3} className="text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 text-foreground font-medium hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 group"
          >
            View All Articles
            <FaArrowRight 
              size={14} 
              className="group-hover:translate-x-1 transition-transform duration-200" 
            />
          </Link>
        </FadeInSection>
      </div>
    </section>
  );
}

export default BlogPreview;
