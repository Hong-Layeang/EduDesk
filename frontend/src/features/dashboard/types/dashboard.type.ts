export interface TeacherProfile {
  name: string;
  academicYear: string;
  avatarUrl: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  minGrade: number;
  maxGrade: number;
}

export interface ClassSummary {
  id: string;
  gradeLabel: string;
  className: string;
  studentCount: number;
  thumbnailUrl: string | null;
}