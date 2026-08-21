import { create } from 'zustand';
import { studentsService } from '../services/students.service';
import type { CreateStudentPayload, Student, StudentClassOption } from '../types/student.type';

const LIST_LIMIT = 50;

interface StudentsState {
  students: Student[];
  classes: StudentClassOption[];
  total: number;
  isLoading: boolean;
  isClassesLoading: boolean;
  isCreating: boolean;
  error: string | null;
  createError: string | null;
  search: string;
  activeClassId: string | null;
}

interface StudentsActions {
  fetchStudents: () => Promise<void>;
  fetchClasses: () => Promise<void>;
  setSearch: (value: string) => void;
  setActiveClass: (classId: string | null) => void;
  createStudent: (payload: CreateStudentPayload) => Promise<boolean>;
  clearCreateError: () => void;
}

export const useStudentsStore = create<StudentsState & StudentsActions>((set, get) => ({
  students: [],
  classes: [],
  total: 0,
  isLoading: false,
  isClassesLoading: false,
  isCreating: false,
  error: null,
  createError: null,
  search: '',
  activeClassId: null,

  fetchStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      const { search, activeClassId } = get();
      const response = await studentsService.findAll({
        page: 1,
        limit: LIST_LIMIT,
        search: search || undefined,
        classId: activeClassId ?? undefined,
      });
      set({ students: response.data, total: response.meta.total, isLoading: false });
    } catch {
      set({ error: 'មិនអាចទាញយកទិន្នន័យសិស្សបានទេ សូមព្យាយាមម្ដងទៀត', isLoading: false });
    }
  },

  fetchClasses: async () => {
    set({ isClassesLoading: true });
    try {
      const classes = await studentsService.getClasses();
      set({ classes, isClassesLoading: false });
    } catch {
      set({ isClassesLoading: false });
    }
  },

  setSearch: (value) => {
    set({ search: value });
    void get().fetchStudents();
  },

  setActiveClass: (classId) => {
    set({ activeClassId: classId });
    void get().fetchStudents();
  },

  createStudent: async (payload) => {
    set({ isCreating: true, createError: null });
    try {
      await studentsService.create(payload);
      set({ isCreating: false });
      await Promise.all([get().fetchStudents(), get().fetchClasses()]);
      return true;
    } catch {
      set({
        isCreating: false,
        createError: 'មិនអាចរក្សាទុកទិន្នន័យសិស្សបានទេ សូមពិនិត្យព័ត៌មាន ហើយព្យាយាមម្ដងទៀត',
      });
      return false;
    }
  },

  clearCreateError: () => set({ createError: null }),
}));