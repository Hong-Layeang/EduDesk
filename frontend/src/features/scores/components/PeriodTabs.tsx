'use client';

import { cn } from '@/utils/cn';
import { PERIOD_TABS } from '@/config/scorePeriods';
import type { PeriodType } from '@/config/scorePeriods';

interface PeriodTabsProps {
  value: PeriodType;
  onChange: (value: PeriodType) => void;
}

export function PeriodTabs({ value, onChange }: PeriodTabsProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
      {PERIOD_TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            'shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-[0.97]',
            value === tab.key
              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
              : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}