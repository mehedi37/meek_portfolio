import { Container } from "@/components/layout/Container";

export default function ProjectLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        {/* Back link skeleton */}
        <div className="h-5 w-36 bg-muted rounded mb-8 skeleton" />

        {/* Header skeleton */}
        <header className="mb-8">
          <div className="h-12 w-3/4 bg-muted rounded mb-4 skeleton" />
          <div className="h-6 w-full bg-muted rounded mb-6 skeleton" />
          <div className="flex gap-4">
            <div className="h-12 w-32 bg-muted rounded-lg skeleton" />
            <div className="h-12 w-32 bg-muted rounded-lg skeleton" />
          </div>
        </header>

        {/* Main image skeleton */}
        <div className="aspect-video bg-muted rounded-xl mb-12 skeleton" />

        {/* Content grid skeleton */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="h-5 bg-muted rounded skeleton"
                style={{ width: `${Math.random() * 30 + 70}%` }}
              />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="h-6 w-24 bg-muted rounded mb-4 skeleton" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 w-20 bg-muted rounded-full skeleton" />
                ))}
              </div>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="h-6 w-28 bg-muted rounded mb-4 skeleton" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-16 bg-muted rounded skeleton" />
                    <div className="h-4 w-20 bg-muted rounded skeleton" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
