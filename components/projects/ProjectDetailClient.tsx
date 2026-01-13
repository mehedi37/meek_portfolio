"use client";

import Link from "next/link";
import Image from "next/image";
import { FadeInSection } from "@/components/animations";
import { Container } from "@/components/layout/Container";
import { Button } from "@heroui/react";
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";
import type { Project } from "@/lib/supabase/types";

interface ProjectDetailClientProps {
  project: Project;
}

/**
 * Project detail page client component
 * Uses Supabase Project type with snake_case field names
 */
export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  return (
    <main className="min-h-screen bg-background">
      <Container className="py-8 sm:py-12">
        {/* Back Button */}
        <FadeInSection className="mb-8">
          <Link href="/#projects">
            <Button variant="ghost" size="sm">
              <FaArrowLeft className="mr-2" />
              Back to Projects
            </Button>
          </Link>
        </FadeInSection>

        {/* Header */}
        <FadeInSection className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {project.featured && (
              <span className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full">
                Featured Project
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
        <FadeInSection className="mb-12">
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

        {/* Main Image */}
        {project.image && (
          <FadeInSection className="mb-12">
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </FadeInSection>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <FadeInSection>
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4">About This Project</h2>
                <div className="whitespace-pre-wrap text-muted-foreground">
                  {project.long_description}
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
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm bg-surface-secondary rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6 bg-surface rounded-2xl">
                  <h3 className="font-semibold mb-4">Project Info</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-muted-foreground">Status</dt>
                      <dd className="font-medium">Completed</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Year</dt>
                      <dd className="font-medium">
                        {project.created_at
                          ? new Date(project.created_at).getFullYear()
                          : "2024"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>

        {/* Additional Images */}
        {project.images && project.images.length > 1 && (
          <FadeInSection className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {project.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-xl overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`${project.title} screenshot ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </FadeInSection>
        )}
      </Container>
    </main>
  );
}
