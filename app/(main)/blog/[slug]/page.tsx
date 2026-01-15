import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FadeInSection } from "@/components/animations";
import { Container } from "@/components/layout/Container";
import { formatDate } from "@/lib/utils";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/supabase/data";
import { FaCalendar, FaClock, FaArrowLeft, FaShare, FaTwitter, FaLinkedin } from "react-icons/fa";

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

              {/* Share buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-muted-foreground mr-1">Share:</span>
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                  title="Share on Twitter"
                >
                  <FaTwitter size={14} />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                  title="Share on LinkedIn"
                >
                  <FaLinkedin size={14} />
                </a>
              </div>
            </div>
          </header>
        </FadeInSection>

        {/* Cover Image */}
        {post.cover_image && (
          <FadeInSection>
            <div className="relative aspect-video rounded-xl overflow-hidden mb-12 shadow-xl">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </FadeInSection>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <FadeInSection>
            <p className="text-xl text-muted-foreground italic border-l-4 border-accent pl-4 mb-8">
              {post.excerpt}
            </p>
          </FadeInSection>
        )}

        {/* Content */}
        <FadeInSection>
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:leading-relaxed prose-p:text-foreground/90
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-xl
              prose-img:rounded-xl prose-img:shadow-lg
              prose-blockquote:border-accent prose-blockquote:bg-accent/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1
              prose-li:marker:text-accent"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
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
              className="inline-flex items-center gap-2 text-accent hover:underline"
            >
              <FaArrowLeft size={12} />
              More posts
            </Link>
          </div>
        </FadeInSection>
      </Container>
    </article>
  );
}
