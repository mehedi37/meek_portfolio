"use client";

import Link from "next/link";
import Image from "next/image";
import { FadeInSection } from "@/components/animations";
import { formatDate } from "@/lib/utils";
import { FaCalendar, FaClock, FaTwitter, FaLinkedin } from "react-icons/fa";
import { HiVideoCamera } from "react-icons/hi";
import type { BlogPost } from "@/lib/supabase/types";

// ============================================================================
// Video URL Detection Utilities
// ============================================================================

function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}

function isVimeoUrl(url: string): boolean {
  return /vimeo\.com/i.test(url);
}

function getYouTubeEmbedUrl(url: string): string {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (videoIdMatch) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  return url;
}

function getVimeoEmbedUrl(url: string): string {
  const videoIdMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (videoIdMatch) {
    return `https://player.vimeo.com/video/${videoIdMatch[1]}`;
  }
  return url;
}

// ============================================================================
// Video Player Component
// ============================================================================

interface VideoPlayerProps {
  url: string;
  poster?: string;
  title: string;
}

function VideoPlayer({ url, poster, title }: VideoPlayerProps) {
  if (isYouTubeUrl(url)) {
    return (
      <iframe
        src={getYouTubeEmbedUrl(url)}
        title={title}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isVimeoUrl(url)) {
    return (
      <iframe
        src={getVimeoEmbedUrl(url)}
        title={title}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // Direct video file - use native HTML5 video
  return (
    <video
      controls
      preload="metadata"
      poster={poster}
      className="absolute inset-0 w-full h-full object-contain bg-black"
      aria-label={`Video: ${title}`}
    >
      <source src={url} type="video/mp4" />
      <source src={url} type="video/webm" />
      Your browser does not support the video tag.
    </video>
  );
}

// ============================================================================
// Main Component
// ============================================================================

interface BlogDetailClientProps {
  post: BlogPost;
  shareUrl: string;
  shareTitle: string;
}

/**
 * Blog detail page with native video player
 * Uses HTML5 <video> for direct files and <iframe> for YouTube/Vimeo
 */
export function BlogDetailClient({ post, shareUrl, shareTitle }: BlogDetailClientProps) {
  const hasVideo = !!post.video_url;
  const hasImage = !!post.cover_image;

  return (
    <div className="pt-8">
      {/* Header */}
      <FadeInSection>
        <header className="mb-8">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Video badge */}
            {hasVideo && (
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full flex items-center gap-1">
                <HiVideoCamera className="w-3 h-3" />
                Video
              </span>
            )}
            {/* Tags */}
            {post.tags && post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

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

      {/* Cover Media - Video Player or Image */}
      {(hasImage || hasVideo) && (
        <FadeInSection>
          <div className="mb-12">
            {hasVideo ? (
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl bg-black">
                <VideoPlayer
                  url={post.video_url!}
                  poster={post.cover_image || undefined}
                  title={post.title}
                />
              </div>
            ) : hasImage ? (
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
                <Image
                  src={post.cover_image!}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
            ) : null}
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
        </div>
      </FadeInSection>
    </div>
  );
}
