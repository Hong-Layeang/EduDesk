'use client';

import { cn } from '@/utils/cn';
import { STATUS_FILTERS } from '@/config/scorePeriods';
import type { StatusFilter } from '@/config/scorePeriods';

interface StatusFilterPillsProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

export function StatusFilterPills({ value, onChange }: StatusFilterPillsProps) {
  return (
    <div className="flex gap-2">
      {STATUS_FILTERS.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={() => onChange(filter.key)}
          className={cn(
            'flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all active:scale-[0.98]',
            value === filter.key
              ? filter.key === 'failed'
                ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
                : filter.key === 'nearFail'
                  ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200'
                  : 'bg-primary/10 text-primary ring-1 ring-primary/30'
              : 'bg-white text-slate-400 ring-1 ring-slate-200 hover:bg-slate-50',
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}