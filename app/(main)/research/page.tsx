import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/supabase/data";
import { FadeInSection } from "@/components/animations";
import { Container } from "@/components/layout/Container";
import { BlogListClient } from "@/components/blog/BlogListClient";
import { FaBookOpen, FaClock } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Research | Portfolio",
  description: "Research papers, write-ups, and academic work.",
  openGraph: {
    title: "Research | Portfolio",
    description: "Research papers, write-ups, and academic work.",
    type: "website",
  },
};

// Revalidate every 15 minutes
export const revalidate = 900;

export default async function ResearchPage() {
  const posts = await getBlogPosts();

  // Calculate total reading time
  const totalReadingTime = posts.reduce((acc, post) => acc + (post.reading_time || 0), 0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        {/* Header */}
        <FadeInSection className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Research
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Papers, write-ups, and ongoing academic work.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="px-4 py-3 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-accent">
                  <FaBookOpen size={16} />
                  <span className="text-2xl font-bold">{posts.length}</span>
                </div>
                <span className="text-xs text-muted-foreground">Entries</span>
              </div>
              <div className="px-4 py-3 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-accent">
                  <FaClock size={14} />
                  <span className="text-2xl font-bold">{totalReadingTime}</span>
                </div>
                <span className="text-xs text-muted-foreground">Min to Read</span>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Research List with Client-side Interactivity */}
        <BlogListClient posts={posts} />

        {/* Contact CTA */}
        <FadeInSection className="mt-20 text-center">
          <div className="p-8 bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl border border-accent/20">
            <h2 className="text-2xl font-bold mb-3">Interested in Collaborating?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Reach out if you'd like to discuss this work or explore a collaboration.
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
