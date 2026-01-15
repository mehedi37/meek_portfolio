import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/supabase/data";
import { FadeInSection } from "@/components/animations";
import { Container } from "@/components/layout/Container";
import { ProjectsListClient } from "@/components/projects/ProjectsListClient";
import { FaArrowLeft, FaRocket } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Projects | Portfolio",
  description: "Explore my portfolio of web development projects, featuring modern technologies and creative solutions.",
  openGraph: {
    title: "Projects | Portfolio",
    description: "Explore my portfolio of web development projects, featuring modern technologies and creative solutions.",
    type: "website",
  },
};

// Revalidate every 30 minutes
export const revalidate = 1800;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        {/* Header */}
        <FadeInSection className="mb-12">
          {/* <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
          >
            <FaArrowLeft size={12} />
            Back to Home
          </Link> */}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Projects
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                A collection of my work spanning web applications, tools, and experiments.
                Each project represents a unique challenge and learning opportunity.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="px-4 py-3 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-accent">
                  <FaRocket size={16} />
                  <span className="text-2xl font-bold">{projects.length}</span>
                </div>
                <span className="text-xs text-muted-foreground">Total Projects</span>
              </div>
              <div className="px-4 py-3 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-accent">
                  <span className="text-2xl font-bold">
                    {projects.filter((p) => p.featured).length}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Featured</span>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Projects List with Client-side Interactivity */}
        <ProjectsListClient projects={projects} />

        {/* Footer CTA */}
        <FadeInSection className="mt-20 text-center">
          <div className="p-8 bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl border border-accent/20">
            <h2 className="text-2xl font-bold mb-3">Interested in working together?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              I&apos;m always open to discussing new projects and opportunities.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </FadeInSection>
      </Container>
    </div>
  );
}
