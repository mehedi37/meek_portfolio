import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailClient } from "@/components/projects/ProjectDetailClient";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/supabase/data";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description || "",
      images: project.image ? [{ url: project.image }] : [],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
