import { Container } from "@/components/layout/Container";

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        {/* Header skeleton */}
        <div className="mb-12 animate-pulse">
          <div className="h-4 w-24 bg-secondary/50 rounded mb-6" />
          <div className="h-12 w-64 bg-secondary/50 rounded mb-4" />
          <div className="h-5 w-96 max-w-full bg-secondary/50 rounded" />
        </div>

        {/* Filters skeleton */}
        <div className="mb-8 flex gap-3 animate-pulse">
          <div className="h-10 w-32 bg-secondary/50 rounded-full" />
          <div className="h-10 w-20 bg-secondary/50 rounded-full" />
          <div className="h-10 w-20 bg-secondary/50 rounded-full" />
        </div>

        {/* Grid skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="bg-card/50 rounded-2xl overflow-hidden border border-border/30">
                {/* Image skeleton */}
                <div className="h-48 bg-secondary/50" />
                {/* Content skeleton */}
                <div className="p-5 space-y-4">
                  <div className="h-6 w-3/4 bg-secondary/50 rounded" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-secondary/30 rounded" />
                    <div className="h-3 w-5/6 bg-secondary/30 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-secondary/30 rounded" />
                    <div className="h-6 w-16 bg-secondary/30 rounded" />
                    <div className="h-6 w-16 bg-secondary/30 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
