import SkeletonCard from "@/components/common/SkeletonCard";

export default function CategoryLoading() {
  return (
    <div className="space-y-6">
      {/* Category banner skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex items-center gap-4 animate-pulse">
        <div className="w-14 h-14 rounded-full bg-slate-200 flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-6 w-32 bg-slate-200 rounded" />
          <div className="h-4 w-48 bg-slate-200 rounded" />
        </div>
      </div>

      {/* Control bar skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center justify-between animate-pulse">
        <div className="h-4 w-36 bg-slate-200 rounded" />
        <div className="h-8 w-28 bg-slate-200 rounded-xl" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
