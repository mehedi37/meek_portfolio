import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FadeInSection } from "@/components/animations";
import { Container } from "@/components/layout/Container";
import { formatDate } from "@/lib/utils";
import { FaCalendar, FaClock, FaArrowLeft } from "react-icons/fa";
import type { BlogPost } from "@/lib/supabase/types";

// Demo blog posts using Supabase BlogPost type with snake_case field names
// In production, fetch from Supabase using: supabase.from('blog_posts').select('*').eq('slug', slug)
const blogPosts: Record<string, BlogPost> = {
  "building-scroll-animations-framer-motion": {
    id: "1",
    slug: "building-scroll-animations-framer-motion",
    title: "Building Scroll-Triggered Animations with Framer Motion",
    excerpt: "Learn how to create engaging scroll-based animations that respond to user scrolling.",
    content: `
# Building Scroll-Triggered Animations with Framer Motion

Scroll-triggered animations are a powerful way to create engaging user experiences. In this tutorial, we'll explore how to use Framer Motion's \`useScroll\` and \`useTransform\` hooks to create beautiful animations.

## Getting Started

First, install Framer Motion:

\`\`\`bash
npm install framer-motion
\`\`\`

## Using useScroll

The \`useScroll\` hook provides scroll progress values:

\`\`\`tsx
import { useScroll, useTransform, motion } from "framer-motion";

function ScrollAnimation() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div style={{ opacity }}>
      This fades as you scroll
    </motion.div>
  );
}
\`\`\`

## Best Practices

1. Use \`useSpring\` for smoother animations
2. Optimize with \`will-change\` CSS property
3. Test on various devices for performance
4. Respect user preferences for reduced motion

## Conclusion

Scroll-triggered animations can significantly enhance user experience when implemented thoughtfully. Remember to prioritize performance and accessibility.
    `,
    cover_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    published_at: "2024-01-15T00:00:00.000Z",
    tags: ["React", "Framer Motion", "Animation", "Tutorial"],
    reading_time: 8,
    published: true,
    author: null,
    created_at: "2024-01-15T00:00:00.000Z",
    updated_at: null,
  },
  "next-js-14-app-router-guide": {
    id: "2",
    slug: "next-js-14-app-router-guide",
    title: "Complete Guide to Next.js 14 App Router",
    excerpt: "Everything you need to know about the new App Router in Next.js 14.",
    content: `
# Complete Guide to Next.js 14 App Router

Next.js 14 brings significant improvements to the App Router architecture. Let's dive deep into its features.

## Server Components

By default, components in the App Router are Server Components:

\`\`\`tsx
// This is a Server Component
async function BlogPosts() {
  const posts = await fetchPosts(); // Direct database access
  return <PostList posts={posts} />;
}
\`\`\`

## Client Components

Use \`"use client"\` for interactive components:

\`\`\`tsx
"use client";

export function LikeButton() {
  const [likes, setLikes] = useState(0);
  return <button onClick={() => setLikes(likes + 1)}>{likes}</button>;
}
\`\`\`

## Loading States

Create instant loading UI with loading.tsx:

\`\`\`tsx
// app/blog/loading.tsx
export default function Loading() {
  return <BlogPostsSkeleton />;
}
\`\`\`

## Conclusion

The App Router provides a more intuitive and powerful way to build Next.js applications.
    `,
    cover_image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800",
    published_at: "2024-01-10T00:00:00.000Z",
    tags: ["Next.js", "React", "Web Development"],
    reading_time: 12,
    published: true,
    author: null,
    created_at: "2024-01-10T00:00:00.000Z",
    updated_at: null,
  },
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen pt-24 pb-16">
      <Container size="sm">
        {/* Back link */}
        <FadeInSection>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <FaArrowLeft className="text-sm" />
            Back to Blog
          </Link>
        </FadeInSection>

        {/* Header */}
        <FadeInSection>
          <header className="mb-8">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {post.published_at && (
                <span className="flex items-center gap-2">
                  <FaCalendar />
                  {formatDate(post.published_at)}
                </span>
              )}
              {post.reading_time && (
                <span className="flex items-center gap-2">
                  <FaClock />
                  {post.reading_time} min read
                </span>
              )}
            </div>
          </header>
        </FadeInSection>

        {/* Cover Image */}
        {post.cover_image && (
          <FadeInSection>
            <div className="relative aspect-video rounded-xl overflow-hidden mb-12">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </FadeInSection>
        )}

        {/* Content */}
        <FadeInSection>
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold
              prose-a:text-accent hover:prose-a:underline
              prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-card prose-pre:border prose-pre:border-border"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </FadeInSection>

        {/* Footer */}
        <FadeInSection className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">
              Thanks for reading! Have questions?{" "}
              <Link href="/#contact" className="text-accent hover:underline">
                Get in touch
              </Link>
            </p>
            <Link
              href="/blog"
              className="text-accent hover:underline"
            >
              ← More posts
            </Link>
          </div>
        </FadeInSection>
      </Container>
    </article>
  );
}
