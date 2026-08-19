'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps {
  placeholder?: string;
  debounceMs?: number;
  onSearch: (value: string) => void;
}

export function SearchInput({ placeholder = 'Search…', debounceMs = 300, onSearch }: SearchInputProps) {
  const [value, setValue] = useState('');
  const debounced = useDebounce(value, debounceMs);

  useEffect(() => { onSearch(debounced); }, [debounced, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}
