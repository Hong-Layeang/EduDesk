import { create } from 'zustand';
import { scoresService } from '../services/scores.service';
import { studentsService } from '@/features/students/services/students.service';
import type { Student, StudentClassOption } from '@/features/students/types/student.type';
import type { SubjectKey } from '@/config/subjects';
import type { PeriodType } from '@/config/scorePeriods';
import { MONTHS } from '@/config/scorePeriods';

type ScoreMap = Record<string, Partial<Record<SubjectKey, number | null>>>;

interface ScoreEntry {
  studentId: string;
  subject: SubjectKey;
  score: string | number | null;
}

interface ScoresState {
  classes: StudentClassOption[];
  activeClassId: string | null;
  periodType: PeriodType;
  monthKey: number;
  students: Student[];
  scores: ScoreMap;
  isLoadingClasses: boolean;
  isLoadingScores: boolean;
  savingKey: string | null;
  error: string | null;
}

interface ScoresActions {
  init: () => Promise<void>;
  setActiveClass: (classId: string) => void;
  setPeriodType: (type: PeriodType) => void;
  setMonthKey: (key: number) => void;
  updateScore: (studentId: string, subject: SubjectKey, score: number) => Promise<void>;
}

type StoreApi = ScoresState & ScoresActions;

export const useScoresStore = create<StoreApi>((set, get) => ({
  classes: [],
  activeClassId: null,
  periodType: 'semester1',
  monthKey: MONTHS[0].key,
  students: [],
  scores: {},
  isLoadingClasses: true,
  isLoadingScores: false,
  savingKey: null,
  error: null,

  init: async () => {
    set({ isLoadingClasses: true, error: null });
    try {
      const classes = await studentsService.getClasses();
      const activeClassId = classes[0]?.classId ?? null;
      set({ classes, activeClassId, isLoadingClasses: false });
      if (activeClassId) await loadClassData(get, set);
    } catch {
      set({ error: 'មិនអាចទាញយកទិន្នន័យបានទេ សូមព្យាយាមម្ដងទៀត', isLoadingClasses: false });
    }
  },

  setActiveClass: (classId) => {
    set({ activeClassId: classId });
    void loadClassData(get, set);
  },

  setPeriodType: (type) => {
    set({ periodType: type });
    void loadClassData(get, set);
  },

  setMonthKey: (key) => {
    set({ monthKey: key });
    void loadClassData(get, set);
  },

  updateScore: async (studentId, subject, score) => {
    const { activeClassId, periodType, monthKey } = get();
    if (!activeClassId || periodType === 'annual') return;

    const key = `${studentId}:${subject}`;
    set({ savingKey: key });

    // Optimistic update so the UI feels instant.
    set((state) => ({
      scores: {
        ...state.scores,
        [studentId]: { ...state.scores[studentId], [subject]: score },
      },
    }));

    try {
      await scoresService.upsert({
        studentId,
        classId: activeClassId,
        subject,
        periodType,
        periodKey: periodType === 'monthly' ? monthKey : 0,
        score,
      });
    } catch {
      set({ error: 'មិនអាចរក្សាទុកពិន្ទុបានទេ សូមព្យាយាមម្ដងទៀត' });
      void loadClassData(get, set);
    } finally {
      set({ savingKey: null });
    }
  },
}));

async function loadClassData(
  get: () => StoreApi,
  set: (partial: Partial<ScoresState>) => void,
): Promise<void> {
  const { activeClassId, periodType, monthKey } = get();
  if (!activeClassId) return;

  set({ isLoadingScores: true, error: null });
  try {
    const studentsPromise = studentsService.findAll({
      classId: activeClassId,
      page: 1,
      limit: 100,
    });

    const scoresPromise: Promise<ScoreEntry[]> =
      periodType === 'annual'
        ? scoresService.findAnnual(activeClassId)
        : scoresService.findForPeriod({
            classId: activeClassId,
            periodType,
            periodKey: periodType === 'monthly' ? monthKey : 0,
          });

    const [studentsRes, scoreRows] = await Promise.all([studentsPromise, scoresPromise]);

    const scores: ScoreMap = {};
    for (const row of scoreRows) {
      const existing = scores[row.studentId] ?? {};
      existing[row.subject] = row.score === null ? null : Number(row.score);
      scores[row.studentId] = existing;
    }

    set({ students: studentsRes.data, scores, isLoadingScores: false });
  } catch {
    set({ error: 'មិនអាចទាញយកពិន្ទុបានទេ សូមព្យាយាមម្ដងទៀត', isLoadingScores: false });
  }
}