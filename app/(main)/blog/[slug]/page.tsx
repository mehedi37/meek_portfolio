import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { BlogDetailClient } from "@/components/blog/BlogDetailClient";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/supabase/data";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Force dynamic rendering to avoid build-time param access issues
export const dynamic = 'force-dynamic';
// Revalidate every 15 minutes
export const revalidate = 900;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get share URLs
  const shareUrl = encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/${slug}`);
  const shareTitle = encodeURIComponent(post.title);

  return (
    <article className="min-h-screen pt-24 pb-16">
      <Container size="sm">
        <BlogDetailClient
          post={post}
          shareUrl={shareUrl}
          shareTitle={shareTitle}
        />
      </Container>
    </article>
  );
}
