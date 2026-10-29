export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm animate-pulse">
      <div className="flex items-center gap-3">
        {/* Emoji Circle Skeleton */}
        <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0" />

        {/* Title & Unit Skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-1/3" />
        </div>
      </div>

      {/* Bottom Price Row Skeleton */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
        <div className="space-y-1.5 w-1/2">
          <div className="h-3 bg-slate-200 rounded w-1/2" />
          <div className="h-5 bg-slate-200 rounded w-3/4" />
        </div>
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
}
