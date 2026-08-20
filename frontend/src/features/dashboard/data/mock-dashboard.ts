import type {
  ClassSummary,
  DashboardStats,
  TeacherProfile,
} from '../types/dashboard.type';

// TODO: replace with a real dashboard.service.ts call once the backend
// exposes a teacher dashboard endpoint. Kept as static data for now so the
// UI can be built and reviewed independently.

export const teacherProfile: TeacherProfile = {
  name: 'សុខា មាស',
  academicYear: 'ឆ្នាំសិក្សា ២០២៤–២០២៥',
  avatarUrl: 'https://i.pravatar.cc/150?img=47',
};

export const dashboardStats: DashboardStats = {
  totalStudents: 142,
  totalClasses: 4,
  minGrade: 3,
  maxGrade: 6,
};

export const classSummaries: ClassSummary[] = [
  {
    id: 'class-6a',
    gradeLabel: 'ថ្នាក់ទី៦',
    className: 'ថ្នាក់ទី៦ក',
    studentCount: 38,
    thumbnailUrl: 'https://picsum.photos/seed/edudesk-class-6a/200/200',
  },
  {
    id: 'class-5b',
    gradeLabel: 'ថ្នាក់ទី៥',
    className: 'ថ្នាក់ទី៥ខ',
    studentCount: 34,
    thumbnailUrl: 'https://picsum.photos/seed/edudesk-class-5b/200/200',
  },
  {
    id: 'class-4a',
    gradeLabel: 'ថ្នាក់ទី៤',
    className: 'ថ្នាក់ទី៤ក',
    studentCount: 35,
    thumbnailUrl: 'https://picsum.photos/seed/edudesk-class-4a/200/200',
  },
  {
    id: 'class-3c',
    gradeLabel: 'ថ្នាក់ទី៣',
    className: 'ថ្នាក់ទី៣គ',
    studentCount: 35,
    thumbnailUrl: 'https://picsum.photos/seed/edudesk-class-3c/200/200',
  },
];