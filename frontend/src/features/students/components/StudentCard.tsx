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
      className="group flex w-full items-center gap-3.5 rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-sm ring-1 ring-slate-900/5 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/[0.03] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:translate-y-0 active:scale-[0.99]"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary/15 to-primary/5 ring-2 ring-white">
        {student.avatarUrl ? (
          <img
            src={student.avatarUrl}
            alt={student.khmerName}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
            {getInitials(student.khmerName)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[15px] font-semibold text-slate-900">{student.khmerName}</p>
          <Badge className={isMale ? 'bg-primary/10 text-primary' : 'bg-pink-50 text-pink-600'}>
            {isMale ? 'ប្រុស' : 'ស្រី'}
          </Badge>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs">
          <span className="font-medium text-primary">{student.className}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400">លេខរៀង {toKhmerNumeral(student.rollNumber)}</span>
        </div>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary/60" />
    </button>
  );
}