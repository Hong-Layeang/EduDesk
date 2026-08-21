import { cn } from '@/utils/cn';
import { gradeColors } from '@/utils/grade';
import type { Grade } from '@/utils/grade';

export function GradeBadge({ grade }: { grade: Grade | null }) {
  if (!grade) {
    return (
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
        —
      </span>
    );
  }

  const { text, bg } = gradeColors[grade];

  return (
    <span
      className={cn(
        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
        bg,
        text,
      )}
    >
      {grade}
    </span>
  );
}