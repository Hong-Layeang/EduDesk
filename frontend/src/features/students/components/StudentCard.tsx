import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toKhmerNumeral } from '@/utils/khmerNumerals';
import type { Student } from '../types/student.type';

function getInitials(name: string): string {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function StudentCard({ student, onClick }: { student: Student; onClick?: () => void }) {
  const isMale = student.gender === 'male';

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm ring-1 ring-slate-900/5 transition-colors hover:bg-blue-50/40 active:scale-[0.99]"
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100">
        {student.avatarUrl ? (
          <img
            src={student.avatarUrl}
            alt={student.englishName}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-400">
            {getInitials(student.englishName)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-900">{student.khmerName}</p>
          <Badge className={isMale ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}>
            {isMale ? 'ប្រុស' : 'ស្រី'}
          </Badge>
        </div>
        <p className="truncate text-sm text-slate-500">{student.englishName}</p>
        <p className="mt-0.5 truncate text-xs font-medium text-blue-600">
          {student.className} · #{toKhmerNumeral(student.rollNumber)}
        </p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300" />
    </button>
  );
}