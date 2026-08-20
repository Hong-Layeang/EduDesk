export interface TeacherProfile {
  name: string;
  academicYear: string;
  avatarUrl: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  gradeRange: string;
}

export interface ClassSummary {
  id: string;
  gradeLabel: string;
  className: string;
  studentCount: number;
  thumbnailUrl: string;
}