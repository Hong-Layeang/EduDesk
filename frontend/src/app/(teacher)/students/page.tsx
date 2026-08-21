'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/shared/SearchInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { EmptyStudentsIllustration } from '@/components/shared/illustrations/EmptyStudents';
import { useStudentsStore } from '@/features/students/store/students.store';
import { StudentCard } from '@/features/students/components/StudentCard';
import { StudentCardSkeleton } from '@/features/students/components/StudentCardSkeleton';
import { ClassFilterPills } from '@/features/students/components/ClassFilterPills';
import { AddStudentDialog } from '@/features/students/components/AddStudentDialog';
import { toKhmerNumeral } from '@/utils/khmerNumerals';

export default function StudentsPage() {
  const {
    students,
    classes,
    total,
    isLoading,
    isClassesLoading,
    error,
    search,
    activeClassId,
    fetchStudents,
    fetchClasses,
    setSearch,
    setActiveClass,
  } = useStudentsStore();

  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    void fetchStudents();
    void fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalStudentsCount = useMemo(
    () => classes.reduce((sum, option) => sum + option.count, 0),
    [classes],
  );

  const hasActiveFilters = Boolean(search || activeClassId);

  const resetFilters = () => {
    setSearch('');
    setActiveClass(null);
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 space-y-4 border-b border-slate-100 bg-slate-50/95 px-4 pb-4 pt-5 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900">សិស្ស</h1>
            <p className="truncate text-xs text-slate-400">
              គ្រប់គ្រងព័ត៌មានសិស្សទាំងអស់របស់អ្នក
            </p>
          </div>
          <Button
            size="icon"
            aria-label="បន្ថែមសិស្សថ្មី"
            onClick={() => setIsAddOpen(true)}
            className="h-11 w-11 shrink-0 rounded-full shadow-md shadow-primary/30"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <SearchInput value={search} placeholder="ស្វែងរកតាមឈ្មោះ..." onSearch={setSearch} />

        {isClassesLoading && classes.length === 0 ? (
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-slate-200" />
            ))}
          </div>
        ) : (
          <ClassFilterPills
            classes={classes}
            activeClassId={activeClassId}
            totalCount={totalStudentsCount}
            onSelect={setActiveClass}
          />
        )}
      </div>

      {/* Body */}
      <div className="flex-1 space-y-3 px-4 pb-6 pt-4">
        <p className="px-1 text-sm text-slate-400">
          {isLoading ? 'កំពុងទាញយកទិន្នន័យ...' : `សិស្ស ${toKhmerNumeral(total)} នាក់ត្រូវបានរកឃើញ`}
        </p>

        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </span>
            <button
              type="button"
              onClick={() => void fetchStudents()}
              className="flex shrink-0 items-center gap-1 font-medium underline underline-offset-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              ព្យាយាមម្ដងទៀត
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StudentCardSkeleton key={i} />
            ))}
          </div>
        ) : students.length === 0 ? (
          <EmptyState
            icon={<EmptyStudentsIllustration className="h-28 w-28" />}
            title="រកមិនឃើញសិស្សទេ"
            description={
              hasActiveFilters
                ? 'សូមព្យាយាមស្វែងរកម្ដងទៀត ឬជ្រើសរើសថ្នាក់ផ្សេង'
                : 'ចាប់ផ្ដើមបន្ថែមសិស្សដំបូងរបស់អ្នក'
            }
            action={
              hasActiveFilters ? (
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  សម្អាតតម្រង
                </Button>
              ) : (
                <Button size="sm" onClick={() => setIsAddOpen(true)}>
                  <Plus className="h-4 w-4" />
                  បន្ថែមសិស្ស
                </Button>
              )
            }
          />
        ) : (
          <div className="space-y-3">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </div>

      <AddStudentDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}