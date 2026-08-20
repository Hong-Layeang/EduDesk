import Link from 'next/link';
import { toKhmerNumeral } from '@/utils/khmerNumerals';
import type { ClassSummary } from '@/features/dashboard/types/dashboard.type';

export function ClassCard({ classItem }: { classItem: ClassSummary }) {
  return (
    <Link
      href={`/students?classId=${classItem.id}`}
      className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5 transition-colors hover:bg-blue-50/60"
    >
      <img
        src={classItem.thumbnailUrl}
        alt={classItem.className}
        className="h-14 w-14 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          {classItem.gradeLabel}
        </p>
        <p className="truncate text-base font-semibold text-slate-900">{classItem.className}</p>
        <p className="text-sm text-slate-500">
          សិស្ស {toKhmerNumeral(classItem.studentCount)} នាក់
        </p>
      </div>
      <svg
        className="h-5 w-5 shrink-0 text-slate-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}