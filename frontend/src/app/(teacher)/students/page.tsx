'use client';

import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/shared/SearchInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { useStudentsStore } from '@/features/students/store/students.store';
import { StudentCard } from '@/features/students/components/StudentCard';
import { StudentCardSkeleton } from '@/features/students/components/StudentCardSkeleton';
import { ClassFilterPills } from '@/features/students/components/ClassFilterPills';
import { toKhmerNumeral } from '@/utils/khmerNumerals';

export default function StudentsPage() {
  const {
    students,
    classes,
    total,
    isLoading,
    error,
    activeClassId,
    fetchStudents,
    fetchClasses,
    setSearch,
    setActiveClass,
  } = useStudentsStore();

  useEffect(() => {
    void fetchStudents();
    void fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-0 z-10 space-y-4 bg-slate-50/95 px-4 pb-4 pt-5 backdrop-blur">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">សិស្ស</h1>
          <Button
            size="icon"
            aria-label="បន្ថែមសិស្សថ្មី"
            className="rounded-full bg-blue-600 shadow-md shadow-blue-600/30 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <SearchInput placeholder="ស្វែងរកតាមឈ្មោះ..." onSearch={setSearch} />

        <ClassFilterPills classes={classes} activeClassId={activeClassId} onSelect={setActiveClass} />
      </div>

      <div className="flex-1 space-y-3 px-4 pb-6">
        <p className="text-sm text-slate-400">
          {isLoading ? 'កំពុងទាញយកទិន្នន័យ...' : `សិស្ស ${toKhmerNumeral(total)} នាក់ត្រូវបានរកឃើញ`}
        </p>

        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StudentCardSkeleton key={i} />
            ))}
          </div>
        ) : students.length === 0 ? (
          <EmptyState
            title="រកមិនឃើញសិស្សទេ"
            description="សូមព្យាយាមស្វែងរកម្ដងទៀត ឬជ្រើសរើសថ្នាក់ផ្សេង"
          />
        ) : (
          <div className="space-y-3">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}