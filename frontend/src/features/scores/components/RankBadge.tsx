import { cn } from '@/utils/cn';
import { toKhmerNumeral } from '@/utils/khmerNumerals';

const RANK_STYLES: Record<number, string> = {
  1: 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-md shadow-amber-500/30',
  2: 'bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-md shadow-slate-400/30',
  3: 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md shadow-amber-700/30',
  4: 'bg-primary/10 text-primary ring-1 ring-primary/20',
  5: 'bg-primary/10 text-primary ring-1 ring-primary/20',
};

export function RankBadge({ rank }: { rank: number }) {
  const isTop = rank >= 1 && rank <= 5;

  return (
    <div
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
        isTop ? RANK_STYLES[rank] : 'bg-slate-100 text-slate-400',
      )}
    >
      {toKhmerNumeral(rank)}
    </div>
  );
}