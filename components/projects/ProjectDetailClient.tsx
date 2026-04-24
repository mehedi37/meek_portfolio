"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FadeInSection } from "@/components/animations";
import { Container } from "@/components/layout/Container";
import { Button, Chip } from "@heroui/react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { HiVideoCamera, HiPhotograph, HiX } from "react-icons/hi";
import type { Project } from "@/lib/supabase/types";

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

function isDirectVideoUrl(url: string): boolean {
  // Check common video extensions
  if (/\.(mp4|webm|ogg|mov|m4v|avi|mkv)(\?.*)?$/i.test(url)) return true;
  // Check Cloudinary video URLs
  if (/cloudinary.*\/video\//i.test(url)) return true;
  // Check generic video paths (but not YouTube/Vimeo)
  if (/\/videos?\//i.test(url) && !isYouTubeUrl(url) && !isVimeoUrl(url)) return true;
  return false;
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

interface ProjectDetailClientProps {
  project: Project;
}

/**
 * Project detail page with native video player
 * Uses HTML5 <video> for direct files and <iframe> for YouTube/Vimeo
 */
export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const hasVideo = !!project.video_url;
  const hasImage = !!project.image;

  return (
    <main className="min-h-screen bg-background pt-16">
      <Container className="py-8 sm:py-12">
        {/* Header */}
        <FadeInSection className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {project.featured && (
              <span className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full">
                Featured Project
              </span>
            )}
            {hasVideo && (
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full flex items-center gap-1">
                <HiVideoCamera className="w-3 h-3" />
                Video Demo
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {project.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {project.description}
          </p>
        </FadeInSection>

        {/* Action Buttons */}
        <FadeInSection className="mb-8">
          <div className="flex flex-wrap gap-4">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                <Button>
                  <FaExternalLinkAlt className="mr-2" />
                  View Live
                </Button>
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary">
                  <FaGithub className="mr-2" />
                  View Code
                </Button>
              </a>
            )}
          </div>
        </FadeInSection>

        {/* Main Media Section - Video Player or Image */}
        <FadeInSection className="mb-12">
          {hasVideo ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
              <VideoPlayer
                url={project.video_url!}
                poster={project.image || undefined}
                title={project.title}
              />
            </div>
          ) : hasImage ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={project.image!}
                alt={project.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          ) : null}
        </FadeInSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <FadeInSection>
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4">About This Project</h2>
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {project.long_description || project.description}
                </div>
              </div>
            </FadeInSection>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FadeInSection>
              <div className="sticky top-24 space-y-8">
                {/* Tech Stack */}
                <div className="p-6 bg-surface rounded-2xl">
                  <h3 className="font-semibold mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <Chip
                        color="accent"
                        size="sm"
                        variant="soft"
                        key={tech}
                        className="px-3 py-1 text-sm bg-surface-accent rounded-full"
                      >
                        {tech}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6 bg-surface rounded-2xl">
                  <h3 className="font-semibold mb-4">Project Info</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-muted-foreground">Status</dt>
                      <dd className="font-medium">
                        {project.is_active ? "Active" : "Completed"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Year</dt>
                      <dd className="font-medium">
                        {project.created_at
                          ? new Date(project.created_at).getFullYear()
                          : new Date().getFullYear()}
                      </dd>
                    </div>
                    {hasVideo && (
                      <div>
                        <dt className="text-sm text-muted-foreground">Media</dt>
                        <dd className="font-medium text-accent flex items-center gap-1">
                          <HiVideoCamera className="w-4 h-4" />
                          Video Demo Available
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>

        {/* Gallery Section */}
        {project.images && project.images.length > 0 && (
          <FadeInSection className="mt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <HiPhotograph className="w-6 h-6 text-accent" />
              Gallery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((image, index) => (
                <motion.button
                  key={index}
                  className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(image)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Image
                    src={image}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1.5 bg-white/90 rounded-full text-sm font-medium text-gray-900">
                      View
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </FadeInSection>
        )}
      </Container>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              <HiX className="w-6 h-6" />
            </button>

            <motion.div
              className="relative w-full max-w-5xl max-h-[85vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt={project.title}
                width={1920}
                height={1080}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
