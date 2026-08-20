'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatCardSkeleton } from '@/components/dashboard/StatCardSkeleton';
import { ReportsCTA } from '@/components/dashboard/ReportsCTA';
import { ClassCard } from '@/components/dashboard/ClassCard';
import { ClassCardSkeleton } from '@/components/dashboard/ClassCardSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useDashboardStore } from '@/features/dashboard/store/dashboard.store';
import { toKhmerNumeral } from '@/utils/khmerNumerals';
import { getCurrentAcademicYearLabel } from '@/utils/academicYear';
import { getAvatarUrl } from '@/utils/avatar';

export default function TeacherDashboardPage() {
  const { user } = useAuthStore();
  const { stats, classes, isLoading, error, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  const teacherName = user?.name ?? 'គ្រូបង្រៀន';

  return (
    <>
      <WelcomeBanner
        name={teacherName}
        academicYear={getCurrentAcademicYearLabel()}
        avatarUrl={getAvatarUrl(teacherName)}
      />

      <div className="space-y-5 px-4 pb-6 pt-5">
        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          {isLoading || !stats ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                label="សិស្សសរុប"
                value={toKhmerNumeral(stats.totalStudents)}
                helper={`នៅក្នុង ${toKhmerNumeral(stats.totalClasses)} ថ្នាក់`}
              />
              <StatCard
                label="ថ្នាក់សកម្ម"
                value={toKhmerNumeral(stats.totalClasses)}
                helper={
                  stats.totalClasses > 0
                    ? `ថ្នាក់ទី${toKhmerNumeral(stats.minGrade)} ដល់ទី${toKhmerNumeral(stats.maxGrade)}`
                    : 'មិនទាន់មានថ្នាក់'
                }
              />
            </>
          )}
        </div>

        <ReportsCTA />

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">ថ្នាក់របស់អ្នក</h2>
            <Link href="/students" className="text-sm font-medium text-blue-600">
              សិស្សទាំងអស់ →
            </Link>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <>
                <ClassCardSkeleton />
                <ClassCardSkeleton />
                <ClassCardSkeleton />
              </>
            ) : classes.length === 0 ? (
              <EmptyState
                title="មិនទាន់មានថ្នាក់ទេ"
                description="បន្ថែមសិស្សដើម្បីឱ្យថ្នាក់បង្ហាញនៅទីនេះ"
              />
            ) : (
              classes.map((classItem) => <ClassCard key={classItem.id} classItem={classItem} />)
            )}
          </div>
        </section>
      </div>
    </>
  );
}