import type { SubjectKey } from '@/config/subjects';
import type { PeriodType } from '@/config/scorePeriods';

export type EditablePeriodType = Exclude<PeriodType, 'annual'>;

export interface ScoreRecord {
  id: string;
  studentId: string;
  classId: string;
  subject: SubjectKey;
  periodType: EditablePeriodType;
  periodKey: number;
  score: string | number;
  createdAt: string;
  updatedAt: string;
}

export interface AnnualScoreRecord {
  studentId: string;
  subject: SubjectKey;
  score: number | null;
}

export interface UpsertScorePayload {
  studentId: string;
  classId: string;
  subject: SubjectKey;
  periodType: EditablePeriodType;
  periodKey: number;
  score: number;
}