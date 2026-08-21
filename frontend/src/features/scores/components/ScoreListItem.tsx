import { GradeBadge } from './GradeBadge';
import { EditableScoreInput } from './EditableScoreInput';
import { getGrade, isFailed, isNearFail } from '@/utils/grade';
import { toKhmerNumeral } from '@/utils/khmerNumerals';
import { cn } from '@/utils/cn';
import type { Student } from '@/features/students/types/student.type';
import { RankBadge } from './RankBadge';

interface ScoreListItemProps {
  rank: number;
  student: Student;
  score: number | null;
  editable: boolean;
  isSaving?: boolean;
  onSave: (score: number) => void;
}

export function ScoreListItem({
  rank,
  student,
  score,
  editable,
  isSaving,
  onSave,
}: ScoreListItemProps) {
  const grade = getGrade(score);
  const failed = isFailed(score);
  const nearFail = isNearFail(score);

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border bg-white p-3.5 shadow-sm ring-1 transition-colors',
        failed
          ? 'border-red-200 bg-red-50/60 ring-red-900/5'
          : nearFail
            ? 'border-orange-200 bg-orange-50/60 ring-orange-900/5'
            : 'border-slate-100 ring-slate-900/5',
      )}
    >
      <RankBadge rank={rank} />

      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary/15 to-primary/5 ring-2 ring-white">
        {student.avatarUrl ? (
          <img
            src={student.avatarUrl}
            alt={student.khmerName}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-primary">
            {student.khmerName.trim().charAt(0)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-slate-900">{student.khmerName}</p>
        <p className="truncate text-xs text-slate-400">
          {student.className} • លេខរៀង {toKhmerNumeral(student.rollNumber)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <EditableScoreInput value={score} disabled={!editable} isSaving={isSaving} onSave={onSave} />
        <GradeBadge grade={grade} />
      </div>
    </div>
  );
}