import { Skeleton } from '@/components/ui/skeleton';

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="mt-2 h-8 w-12" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  );
}