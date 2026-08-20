import Link from 'next/link';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { StatCard } from '@/components/dashboard/StatCard';
import { ReportsCTA } from '@/components/dashboard/ReportsCTA';
import { ClassCard } from '@/components/dashboard/ClassCard';
import { toKhmerNumeral } from '@/utils/khmerNumerals';
import {
  classSummaries,
  dashboardStats,
  teacherProfile,
} from '@/features/dashboard/data/mock-dashboard';

export default function TeacherDashboardPage() {
  return (
    <>
      <WelcomeBanner
        name={teacherProfile.name}
        academicYear={teacherProfile.academicYear}
        avatarUrl={teacherProfile.avatarUrl}
      />

      <div className="space-y-5 px-4 pb-6 pt-5">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="សិស្សសរុប"
            value={toKhmerNumeral(dashboardStats.totalStudents)}
            helper={`នៅក្នុង ${toKhmerNumeral(dashboardStats.totalClasses)} ថ្នាក់`}
          />
          <StatCard
            label="ថ្នាក់សកម្ម"
            value={toKhmerNumeral(dashboardStats.totalClasses)}
            helper={dashboardStats.gradeRange}
          />
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
            {classSummaries.map((classItem) => (
              <ClassCard key={classItem.id} classItem={classItem} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}