'use client';

import { cn } from '@/utils/cn';
import { toKhmerNumeral } from '@/utils/khmerNumerals';
import type { StudentClassOption } from '../types/student.type';

interface ClassFilterPillsProps {
  classes: StudentClassOption[];
  activeClassId: string | null;
  totalCount: number;
  onSelect: (classId: string | null) => void;
}

export function ClassFilterPills({
  classes,
  activeClassId,
  totalCount,
  onSelect,
}: ClassFilterPillsProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      <Pill
        label="ថ្នាក់ទាំងអស់"
        count={totalCount}
        active={activeClassId === null}
        onClick={() => onSelect(null)}
      />
      {classes.map((option) => (
        <Pill
          key={option.classId}
          label={option.className}
          count={option.count}
          active={activeClassId === option.classId}
          onClick={() => onSelect(option.classId)}
        />
      ))}
    </div>
  );
}

function Pill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
          : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50',
      )}
    >
      {label}
      <span
        className={cn(
          'rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
          active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400',
        )}
      >
        {toKhmerNumeral(count)}
      </span>
    </button>
  );
}