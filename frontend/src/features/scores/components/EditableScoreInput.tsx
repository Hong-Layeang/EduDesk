'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

interface EditableScoreInputProps {
  value: number | null;
  disabled?: boolean;
  isSaving?: boolean;
  onSave: (value: number) => void;
}

export function EditableScoreInput({
  value,
  disabled,
  isSaving,
  onSave,
}: EditableScoreInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value !== null ? String(value) : '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) setDraft(value !== null ? String(value) : '');
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const commit = () => {
    setIsEditing(false);
    if (draft.trim() === '') return;

    const parsed = Number(draft);
    if (Number.isNaN(parsed)) {
      setDraft(value !== null ? String(value) : '');
      return;
    }

    const clamped = Math.min(10, Math.max(0, Math.round(parsed * 2) / 2));
    setDraft(String(clamped));
    if (clamped !== value) onSave(clamped);
  };

  if (disabled) {
    return (
      <span className="min-w-10 text-center text-lg font-bold text-slate-400">
        {value !== null ? value : '—'}
      </span>
    );
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        disabled={isSaving}
        className={cn(
          'min-w-10 rounded-lg px-2 py-1 text-center text-lg font-bold text-slate-900 transition-colors hover:bg-primary/10 hover:text-primary',
          isSaving && 'opacity-50',
        )}
      >
        {value !== null ? value : '—'}
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      type="number"
      min={0}
      max={10}
      step={0.5}
      inputMode="decimal"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          commit();
        }
        if (e.key === 'Escape') {
          setDraft(value !== null ? String(value) : '');
          setIsEditing(false);
        }
      }}
      className="w-16 rounded-lg border-2 border-primary bg-white px-2 py-1 text-center text-lg font-bold text-slate-900 outline-none"
    />
  );
}