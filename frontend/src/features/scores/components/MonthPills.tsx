'use client';

import { cn } from '@/utils/cn';
import { MONTHS } from '@/config/scorePeriods';

interface MonthPillsProps {
  value: number;
  onChange: (value: number) => void;
}

export function MonthPills({ value, onChange }: MonthPillsProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
      {MONTHS.map((month) => (
        <button
          key={month.key}
          type="button"
          onClick={() => onChange(month.key)}
          className={cn(
            'shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97]',
            value === month.key
              ? 'bg-primary/10 text-primary ring-1 ring-primary/30'
              : 'bg-white text-slate-400 ring-1 ring-slate-200 hover:bg-slate-50',
          )}
        >
          {month.label}
        </button>
      ))}
    </div>
  );
}