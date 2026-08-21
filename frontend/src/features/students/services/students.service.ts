import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api-response.type';
import type {
  CreateStudentPayload,
  FindStudentsParams,
  Student,
  StudentClassOption,
} from '../types/student.type';

export const studentsService = {
  findAll: async (params: FindStudentsParams): Promise<PaginatedResponse<Student>> => {
    const { data } = await api.get<PaginatedResponse<Student>>('/students', { params });
    return data;
  },

  getClasses: async (): Promise<StudentClassOption[]> => {
    const { data } = await api.get<ApiResponse<StudentClassOption[]>>('/students/classes');
    return data.data;
  },

  create: async (payload: CreateStudentPayload): Promise<Student> => {
    const { data } = await api.post<ApiResponse<Student>>('/students', payload);
    return data.data;
  },
};