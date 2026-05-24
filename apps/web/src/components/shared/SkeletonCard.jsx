import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard({ lines = 3 }) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24 bg-muted" />
        <Skeleton className="h-8 w-8 rounded-lg bg-muted" />
      </div>
      <Skeleton className="h-7 w-32 bg-muted" />
      {Array.from({ length: lines - 2 }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-16 bg-muted" />
      ))}
    </div>
  );
}