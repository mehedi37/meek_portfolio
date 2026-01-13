import { Container } from "@/components/layout/Container";

export default function BlogLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        {/* Header skeleton */}
        <div className="text-center mb-16">
          <div className="h-12 w-32 bg-muted rounded-lg mx-auto mb-4 skeleton" />
          <div className="h-6 w-96 max-w-full bg-muted rounded-lg mx-auto skeleton" />
        </div>

        {/* Featured posts skeleton */}
        <div className="mb-16">
          <div className="h-8 w-40 bg-muted rounded-lg mb-8 skeleton" />
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                <div className="aspect-video bg-muted skeleton" />
                <div className="p-6 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-muted rounded-full skeleton" />
                    <div className="h-6 w-20 bg-muted rounded-full skeleton" />
                  </div>
                  <div className="h-6 w-3/4 bg-muted rounded skeleton" />
                  <div className="h-4 w-full bg-muted rounded skeleton" />
                  <div className="h-4 w-2/3 bg-muted rounded skeleton" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All posts skeleton */}
        <div>
          <div className="h-8 w-32 bg-muted rounded-lg mb-8 skeleton" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                <div className="aspect-video bg-muted skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-muted rounded skeleton" />
                  <div className="h-4 w-full bg-muted rounded skeleton" />
                  <div className="h-4 w-1/2 bg-muted rounded skeleton" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
