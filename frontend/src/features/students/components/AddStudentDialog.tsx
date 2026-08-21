'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStudentsStore } from '../store/students.store';
import type { Gender } from '../types/student.type';

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  khmerName: string;
  gender: Gender | '';
  classId: string;
  rollNumber: string;
}

const EMPTY_FORM: FormState = {
  khmerName: '',
  gender: '',
  classId: '',
  rollNumber: '',
};

export function AddStudentDialog({ open, onOpenChange }: AddStudentDialogProps) {
  const { classes, isCreating, createError, createStudent, clearCreateError } = useStudentsStore();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      clearCreateError();
    }
  }, [open, clearCreateError]);

  const isValid =
    form.khmerName.trim().length > 0 &&
    form.gender.length > 0 &&
    form.classId.length > 0 &&
    form.rollNumber.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const selectedClass = classes.find((option) => option.classId === form.classId);
    if (!selectedClass) return;

    const success = await createStudent({
      khmerName: form.khmerName.trim(),
      gender: form.gender as Gender,
      classId: selectedClass.classId,
      className: selectedClass.className,
      rollNumber: form.rollNumber.trim(),
    });

    if (success) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>បន្ថែមសិស្សថ្មី</DialogTitle>
            <DialogDescription>
              បំពេញព័ត៌មានខាងក្រោមដើម្បីបញ្ចូលសិស្សថ្មីទៅក្នុងបញ្ជី
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <Field label="ឈ្មោះសិស្ស">
              <Input
                value={form.khmerName}
                onChange={(e) => setForm((f) => ({ ...f, khmerName: e.target.value }))}
                placeholder="ឧ. ចាន់ ដារា"
                maxLength={100}
                required
              />
            </Field>

            <Field label="ភេទ">
              <Select
                value={form.gender}
                onValueChange={(value) => setForm((f) => ({ ...f, gender: value as Gender }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="ជ្រើសរើសភេទ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">ប្រុស</SelectItem>
                  <SelectItem value="female">ស្រី</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="ថ្នាក់">
              <Select
                value={form.classId}
                onValueChange={(value) => setForm((f) => ({ ...f, classId: value ?? '' }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="ជ្រើសរើសថ្នាក់" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((option) => (
                    <SelectItem key={option.classId} value={option.classId}>
                      {option.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {classes.length === 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  មិនទាន់មានថ្នាក់នៅឡើយទេ សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ
                </p>
              )}
            </Field>

            <Field label="លេខរៀង">
              <Input
                value={form.rollNumber}
                onChange={(e) => setForm((f) => ({ ...f, rollNumber: e.target.value }))}
                placeholder="ឧ. ០០១"
                maxLength={20}
                required
              />
            </Field>

            {createError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {createError}
              </p>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              បោះបង់
            </Button>
            <Button type="submit" disabled={!isValid || isCreating}>
              {isCreating ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}