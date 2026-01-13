import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailClient } from "@/components/projects/ProjectDetailClient";
import type { Project } from "@/lib/supabase/types";

// Demo projects using Supabase Project type with snake_case field names
// In production, fetch from Supabase using: supabase.from('projects').select('*').eq('slug', slug)
const projects: Record<string, Project> = {
  "portfolio-website": {
    id: "1",
    slug: "portfolio-website",
    title: "Portfolio Website",
    description: "A unique, visually engaging portfolio website with scroll-triggered animations.",
    long_description: `This portfolio website features a unique "Growing Boy" animation that evolves as users scroll through the page. Built with modern technologies and optimized for performance.

Key Features:
• Scroll-Triggered Animations - The character progresses through 4 stages based on scroll position
• Dark/Light Mode - Automatic theme detection with manual toggle
• Responsive Design - Mobile-first approach
• SEO Optimized - Meta tags, Open Graph, JSON-LD structured data
• Performance Focused - Image optimization, code splitting, lazy loading

The animation system uses Framer Motion's useScroll and useTransform hooks for smooth, GPU-accelerated animations.`,
    tech_stack: ["Next.js 14", "TypeScript", "Tailwind CSS v4", "Framer Motion", "HeroUI v3", "Supabase"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    ],
    live_url: "https://yoursite.com",
    github_url: "https://github.com/yourusername/portfolio",
    featured: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: null,
  },
  "ai-dashboard": {
    id: "2",
    slug: "ai-dashboard",
    title: "AI Analytics Dashboard",
    description: "Real-time AI-powered analytics dashboard with interactive visualizations.",
    long_description: `A comprehensive analytics dashboard that leverages AI to provide insights from complex data sets.

Features:
• Real-time data streaming with WebSocket connections
• AI-powered anomaly detection
• Interactive charts with drill-down capabilities
• Export to PDF/Excel
• Role-based access control

Built with a microservices architecture using Docker and Kubernetes for scalability.`,
    tech_stack: ["React", "Python", "FastAPI", "TensorFlow", "PostgreSQL", "Redis"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    ],
    live_url: "https://dashboard-demo.com",
    github_url: "https://github.com/yourusername/ai-dashboard",
    featured: true,
    created_at: "2023-10-15T00:00:00.000Z",
    updated_at: null,
  },
};

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects[slug];

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.image ? [{ url: project.image }] : [],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects[slug];

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
