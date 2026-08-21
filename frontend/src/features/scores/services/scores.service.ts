import api from '@/lib/api';
import type { ApiResponse } from '@/types/api-response.type';
import type {
  AnnualScoreRecord,
  EditablePeriodType,
  ScoreRecord,
  UpsertScorePayload,
} from '../types/score.type';

export const scoresService = {
  findForPeriod: async (params: {
    classId: string;
    periodType: EditablePeriodType;
    periodKey?: number;
  }): Promise<ScoreRecord[]> => {
    const { data } = await api.get<ApiResponse<ScoreRecord[]>>('/scores', { params });
    return data.data;
  },

  findAnnual: async (classId: string): Promise<AnnualScoreRecord[]> => {
    const { data } = await api.get<ApiResponse<AnnualScoreRecord[]>>('/scores/annual', {
      params: { classId },
    });
    return data.data;
  },

  upsert: async (payload: UpsertScorePayload): Promise<ScoreRecord> => {
    const { data } = await api.put<ApiResponse<ScoreRecord>>('/scores', payload);
    return data.data;
  },
};