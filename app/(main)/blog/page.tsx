import Link from "next/link";
import type { Metadata } from "next";
import { FadeInSection } from "@/components/animations";
import { BlogCard } from "@/components/ui";
import { Container } from "@/components/layout/Container";
import type { BlogPost } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and insights on web development, programming, and technology.",
};

// Demo blog posts using Supabase BlogPost type with snake_case field names
// In production, fetch from Supabase using: supabase.from('blog_posts').select('*')
const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "building-scroll-animations-framer-motion",
    title: "Building Scroll-Triggered Animations with Framer Motion",
    excerpt: "Learn how to create engaging scroll-based animations that respond to user scrolling using Framer Motion's useScroll and useTransform hooks.",
    content: "",
    cover_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    published_at: "2024-01-15T00:00:00.000Z",
    tags: ["React", "Framer Motion", "Animation", "Tutorial"],
    reading_time: 8,
    published: true,
    author: null,
    created_at: "2024-01-15T00:00:00.000Z",
    updated_at: null,
  },
  {
    id: "2",
    slug: "next-js-14-app-router-guide",
    title: "Complete Guide to Next.js 14 App Router",
    excerpt: "Everything you need to know about the new App Router in Next.js 14, including server components, loading states, and error handling.",
    content: "",
    cover_image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800",
    published_at: "2024-01-10T00:00:00.000Z",
    tags: ["Next.js", "React", "Web Development"],
    reading_time: 12,
    published: true,
    author: null,
    created_at: "2024-01-10T00:00:00.000Z",
    updated_at: null,
  },
  {
    id: "3",
    slug: "typescript-best-practices-2024",
    title: "TypeScript Best Practices for 2024",
    excerpt: "Essential TypeScript patterns and practices to write cleaner, more maintainable code in your projects.",
    content: "",
    cover_image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    published_at: "2024-01-05T00:00:00.000Z",
    tags: ["TypeScript", "Best Practices"],
    reading_time: 10,
    published: true,
    author: null,
    created_at: "2024-01-05T00:00:00.000Z",
    updated_at: null,
  },
  {
    id: "4",
    slug: "supabase-authentication-guide",
    title: "Implementing Authentication with Supabase",
    excerpt: "A step-by-step guide to adding secure authentication to your Next.js app using Supabase Auth.",
    content: "",
    cover_image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    published_at: "2023-12-28T00:00:00.000Z",
    tags: ["Supabase", "Authentication", "Next.js"],
    reading_time: 15,
    published: true,
    author: null,
    created_at: "2023-12-28T00:00:00.000Z",
    updated_at: null,
  },
  {
    id: "5",
    slug: "tailwind-css-v4-whats-new",
    title: "What's New in Tailwind CSS v4",
    excerpt: "Explore the exciting new features and improvements coming in Tailwind CSS version 4.",
    content: "",
    cover_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    published_at: "2023-12-20T00:00:00.000Z",
    tags: ["Tailwind CSS", "CSS", "Web Development"],
    reading_time: 7,
    published: true,
    author: null,
    created_at: "2023-12-20T00:00:00.000Z",
    updated_at: null,
  },
  {
    id: "6",
    slug: "react-performance-optimization",
    title: "React Performance Optimization Techniques",
    excerpt: "Practical strategies to optimize your React applications for better performance and user experience.",
    content: "",
    cover_image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
    published_at: "2023-12-15T00:00:00.000Z",
    tags: ["React", "Performance", "Optimization"],
    reading_time: 11,
    published: true,
    author: null,
    created_at: "2023-12-15T00:00:00.000Z",
    updated_at: null,
  },
];

export default function BlogPage() {
  // Filter by first two posts as "featured" for demo purposes
  const featuredPosts = blogPosts.slice(0, 2);
  const regularPosts = blogPosts.slice(2);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        {/* Header */}
        <FadeInSection className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on web development, programming, and technology.
          </p>
        </FadeInSection>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <FadeInSection className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Featured Posts</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </FadeInSection>
        )}

        {/* All Posts */}
        <FadeInSection>
          <h2 className="text-2xl font-bold mb-8">All Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </FadeInSection>

        {/* Back to home */}
        <FadeInSection className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-accent hover:underline"
          >
            ← Back to Home
          </Link>
        </FadeInSection>
      </Container>
    </div>
  );
}
