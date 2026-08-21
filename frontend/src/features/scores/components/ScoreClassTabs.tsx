'use client';

import { cn } from '@/utils/cn';
import type { StudentClassOption } from '@/features/students/types/student.type';

interface ScoreClassTabsProps {
  classes: StudentClassOption[];
  activeClassId: string | null;
  onSelect: (classId: string) => void;
}

export function ScoreClassTabs({ classes, activeClassId, onSelect }: ScoreClassTabsProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
      {classes.map((option) => (
        <button
          key={option.classId}
          type="button"
          onClick={() => onSelect(option.classId)}
          className={cn(
            'shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-[0.97]',
            activeClassId === option.classId
              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
              : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50',
          )}
        >
          {option.className}
        </button>
      ))}
    </div>
  );
}