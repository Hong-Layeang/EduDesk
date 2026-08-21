'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/utils/cn';

interface SearchInputProps {
  value?: string;
  placeholder?: string;
  debounceMs?: number;
  onSearch: (value: string) => void;
  className?: string;
}

export function SearchInput({
  value: externalValue,
  placeholder = 'ស្វែងរក...',
  debounceMs = 300,
  onSearch,
  className,
}: SearchInputProps) {
  const [value, setValue] = useState(externalValue ?? '');
  const debounced = useDebounce(value, debounceMs);

  useEffect(() => {
    onSearch(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  useEffect(() => {
    if (externalValue !== undefined && externalValue !== value) {
      setValue(externalValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalValue]);

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-slate-900/5 transition-colors focus-within:ring-2 focus-within:ring-primary/40',
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-slate-400" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label="សម្អាតការស្វែងរក"
          className="shrink-0 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}