import { Container } from "@/components/layout/Container";

export default function BlogPostLoading() {
  return (
    <article className="min-h-screen pt-24 pb-16">
      <Container size="sm">
        {/* Back link skeleton */}
        <div className="h-5 w-28 bg-secondary/50 rounded mb-8 animate-pulse" />

        {/* Header skeleton */}
        <header className="mb-8 animate-pulse">
          {/* Tags */}
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-16 bg-secondary/30 rounded-full" />
            <div className="h-6 w-20 bg-secondary/30 rounded-full" />
            <div className="h-6 w-14 bg-secondary/30 rounded-full" />
          </div>

          {/* Title */}
          <div className="space-y-3 mb-4">
            <div className="h-10 w-full bg-secondary/50 rounded" />
            <div className="h-10 w-2/3 bg-secondary/50 rounded" />
          </div>

          {/* Meta */}
          <div className="flex gap-4">
            <div className="h-4 w-28 bg-secondary/30 rounded" />
            <div className="h-4 w-24 bg-secondary/30 rounded" />
          </div>
        </header>

        {/* Cover image skeleton */}
        <div className="aspect-video rounded-xl bg-secondary/50 mb-12 animate-pulse" />

        {/* Excerpt skeleton */}
        <div className="border-l-4 border-secondary/50 pl-4 mb-8 animate-pulse">
          <div className="h-5 w-full bg-secondary/30 rounded mb-2" />
          <div className="h-5 w-4/5 bg-secondary/30 rounded" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-6 animate-pulse">
          {/* Paragraph */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-secondary/30 rounded" />
            <div className="h-4 w-full bg-secondary/30 rounded" />
            <div className="h-4 w-3/4 bg-secondary/30 rounded" />
          </div>

          {/* Heading */}
          <div className="h-7 w-1/2 bg-secondary/50 rounded mt-8" />

          {/* Paragraph */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-secondary/30 rounded" />
            <div className="h-4 w-full bg-secondary/30 rounded" />
            <div className="h-4 w-5/6 bg-secondary/30 rounded" />
          </div>

          {/* Code block */}
          <div className="h-40 w-full bg-card rounded-xl border border-border" />

          {/* Paragraph */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-secondary/30 rounded" />
            <div className="h-4 w-4/5 bg-secondary/30 rounded" />
          </div>
        </div>
      </Container>
    </article>
  );
}
