export default function CertificationsLoading() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-16">
          <div className="h-8 w-48 bg-default rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-96 bg-default rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-full max-w-2xl bg-default rounded-lg mx-auto animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-default rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
