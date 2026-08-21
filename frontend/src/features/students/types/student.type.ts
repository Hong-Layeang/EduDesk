export type Gender = 'male' | 'female';

export interface Student {
  id: string;
  khmerName: string;
  gender: Gender;
  classId: string;
  className: string;
  rollNumber: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentClassOption {
  classId: string;
  className: string;
  count: number;
}

export interface FindStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
}

export interface CreateStudentPayload {
  khmerName: string;
  gender: Gender;
  classId: string;
  className: string;
  rollNumber: string;
  avatarUrl?: string;
}