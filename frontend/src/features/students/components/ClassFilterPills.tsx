'use client';

import { cn } from '@/utils/cn';
import type { StudentClassOption } from '../types/student.type';

interface ClassFilterPillsProps {
  classes: StudentClassOption[];
  activeClassId: string | null;
  onSelect: (classId: string | null) => void;
}

export function ClassFilterPills({ classes, activeClassId, onSelect }: ClassFilterPillsProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      <Pill label="ថ្នាក់ទាំងអស់" active={activeClassId === null} onClick={() => onSelect(null)} />
      {classes.map((option) => (
        <Pill
          key={option.classId}
          label={option.className}
          active={activeClassId === option.classId}
          onClick={() => onSelect(option.classId)}
        />
      ))}
    </div>
  );
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50',
      )}
    >
      {label}
    </button>
  );
}