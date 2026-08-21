'use client';

import { cn } from '@/utils/cn';
import { SUBJECTS, AVERAGE_KEY } from '@/config/subjects';
import type { SubjectKey } from '@/config/subjects';

interface SubjectTabsProps {
  value: SubjectKey | typeof AVERAGE_KEY;
  onChange: (value: SubjectKey | typeof AVERAGE_KEY) => void;
}

export function SubjectTabs({ value, onChange }: SubjectTabsProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
      {SUBJECTS.map((subject) => (
        <button
          key={subject.key}
          type="button"
          onClick={() => onChange(subject.key)}
          className={cn(
            'shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-[0.97]',
            value === subject.key
              ? 'bg-white text-primary shadow-sm ring-1 ring-primary/30'
              : 'bg-transparent text-slate-400 hover:text-slate-600',
          )}
        >
          {subject.label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(AVERAGE_KEY)}
        className={cn(
          'shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-[0.97]',
          value === AVERAGE_KEY
            ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
            : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
        )}
      >
        មធ្យមភាគ
      </button>
    </div>
  );
}