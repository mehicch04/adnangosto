import { Skeleton } from "@/components/admin/ui";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Učitavanje">
      <Skeleton className="h-12 w-56" />
      <Skeleton className="mt-3 h-4 w-72" />
      <div className="mt-8 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-6 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[72px] w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
