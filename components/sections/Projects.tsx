"use client";

import { motion } from "framer-motion";
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/animations";
import { ProjectCard } from "@/components/ui/ProjectCard";
import type { Project } from "@/lib/supabase/types";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

// Demo projects using Supabase Project type
const DEMO_PROJECTS: Project[] = [
  {
    id: "1",
    slug: "ecommerce-platform",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory, payment processing, and admin dashboard.",
    long_description: null,
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
    images: null,
    tech_stack: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    live_url: "https://example.com",
    github_url: "https://github.com",
    featured: true,
    created_at: "2024-01-15T00:00:00.000Z",
    updated_at: null,
  },
  {
    id: "2",
    slug: "ai-chat-assistant",
    title: "AI Chat Assistant",
    description: "Intelligent chatbot powered by GPT-4 with context awareness and multi-language support.",
    long_description: null,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    images: null,
    tech_stack: ["Python", "OpenAI", "React", "FastAPI"],
    live_url: "https://example.com",
    github_url: "https://github.com",
    featured: true,
    created_at: "2024-02-20T00:00:00.000Z",
    updated_at: null,
  },
  {
    id: "3",
    slug: "task-management-app",
    title: "Task Management App",
    description: "Collaborative task manager with real-time updates, drag-and-drop, and team workspaces.",
    long_description: null,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800",
    images: null,
    tech_stack: ["React", "Node.js", "Socket.io", "MongoDB"],
    live_url: "https://example.com",
    github_url: "https://github.com",
    featured: true,
    created_at: "2024-03-10T00:00:00.000Z",
    updated_at: null,
  },
  {
    id: "4",
    slug: "mobile-fitness-app",
    title: "Mobile Fitness App",
    description: "Cross-platform fitness tracking app with workout plans, progress charts, and social features.",
    long_description: null,
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800",
    images: null,
    tech_stack: ["React Native", "TypeScript", "Firebase"],
    live_url: null,
    github_url: "https://github.com",
    featured: false,
    created_at: "2024-04-05T00:00:00.000Z",
    updated_at: null,
  },
  {
    id: "5",
    slug: "api-gateway-service",
    title: "API Gateway Service",
    description: "Microservice API gateway with rate limiting, authentication, and request transformation.",
    long_description: null,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    images: null,
    tech_stack: ["Go", "Docker", "Kubernetes", "Redis"],
    live_url: null,
    github_url: "https://github.com",
    featured: false,
    created_at: "2024-05-12T00:00:00.000Z",
    updated_at: null,
  },
  {
    id: "6",
    slug: "data-visualization-dashboard",
    title: "Data Visualization Dashboard",
    description: "Interactive dashboard for business analytics with custom charts and real-time data streaming.",
    long_description: null,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    images: null,
    tech_stack: ["React", "D3.js", "Python", "WebSocket"],
    live_url: "https://example.com",
    github_url: null,
    featured: false,
    created_at: "2024-06-18T00:00:00.000Z",
    updated_at: null,
  },
];

interface ProjectsProps {
  className?: string;
  projects?: Project[];
}

/**
 * Professional projects section with grid layout
 */
export function Projects({ className = "", projects = DEMO_PROJECTS }: ProjectsProps) {
  const [showAll, setShowAll] = useState(false);

  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const displayedProjects = showAll ? sortedProjects : sortedProjects.slice(0, 6);

  return (
    <section id="projects" className={`relative py-24 lg:py-32 ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of projects showcasing my expertise in building modern, scalable applications.
          </p>
        </FadeInSection>

        {/* Projects Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayedProjects.map((project, index) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} index={index} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Show More Button */}
        {sortedProjects.length > 6 && !showAll && (
          <FadeInSection delay={0.3} className="text-center mt-12">
            <motion.button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground bg-secondary/80 hover:bg-secondary border border-border/50 rounded-xl transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Projects ({sortedProjects.length})
              <FaArrowRight size={12} />
            </motion.button>
          </FadeInSection>
        )}

        {/* Empty State */}
        {sortedProjects.length === 0 && (
          <FadeInSection className="text-center py-12">
            <p className="text-muted-foreground">No projects found. Check back soon!</p>
          </FadeInSection>
        )}
      </div>
    </section>
  );
}

export default Projects;
