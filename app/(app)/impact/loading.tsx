export default function ImpactLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="h-10 w-48 rounded-xl bg-white/5 animate-pulse" />
        <div className="h-5 w-72 rounded-lg bg-white/5 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-72 rounded-2xl bg-white/5 animate-pulse" />
      </div>
      <div className="h-80 rounded-2xl bg-white/5 animate-pulse" />
    </div>
  );
}
