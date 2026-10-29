export default function ProductLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-4 w-32 bg-slate-200 rounded" />

      {/* Top summary card skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-slate-200 flex-shrink-0" />
        <div className="flex-1 space-y-3 w-full">
          <div className="h-7 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
        </div>
      </div>

      {/* Price summary skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-8 w-32 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* Market table skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
        <div className="h-6 w-48 bg-slate-200 rounded" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
