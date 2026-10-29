import SkeletonCard from "@/components/common/SkeletonCard";

export default function Loading() {
  return (
    <div className="space-y-10">
      {/* Hero skeleton */}
      <div className="w-full h-64 bg-slate-200/80 rounded-3xl animate-pulse" />

      {/* Section skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
