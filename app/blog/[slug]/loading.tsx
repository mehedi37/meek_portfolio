import { Container } from "@/components/layout/Container";

export default function BlogPostLoading() {
  return (
    <article className="min-h-screen pt-24 pb-16">
      <Container size="sm">
        {/* Back link skeleton */}
        <div className="h-5 w-28 bg-muted rounded mb-8 skeleton" />

        {/* Header skeleton */}
        <header className="mb-8">
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-16 bg-muted rounded-full skeleton" />
            <div className="h-6 w-20 bg-muted rounded-full skeleton" />
            <div className="h-6 w-14 bg-muted rounded-full skeleton" />
          </div>
          <div className="h-12 w-full bg-muted rounded mb-4 skeleton" />
          <div className="h-8 w-3/4 bg-muted rounded mb-4 skeleton" />
          <div className="flex gap-4">
            <div className="h-5 w-32 bg-muted rounded skeleton" />
            <div className="h-5 w-24 bg-muted rounded skeleton" />
          </div>
        </header>

        {/* Cover image skeleton */}
        <div className="aspect-video bg-muted rounded-xl mb-12 skeleton" />

        {/* Content skeleton */}
        <div className="space-y-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="h-5 bg-muted rounded skeleton"
              style={{ width: `${Math.random() * 30 + 70}%` }}
            />
          ))}
        </div>
      </Container>
    </article>
  );
}
