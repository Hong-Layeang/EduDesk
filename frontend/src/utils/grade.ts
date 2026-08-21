export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

/**
 * Mirrors: =IF(score>=9,"A", IF(score>=8,"B", IF(score>=7,"C",
 *          IF(score>=6,"D", IF(score>=5,"E","F")))))
 */
export function getGrade(score: number | null): Grade | null {
  if (score === null || Number.isNaN(score)) return null;
  if (score >= 9) return 'A';
  if (score >= 8) return 'B';
  if (score >= 7) return 'C';
  if (score >= 6) return 'D';
  if (score >= 5) return 'E';
  return 'F';
}

export function isFailed(score: number | null): boolean {
  return score !== null && score < 5;
}

export function isNearFail(score: number | null): boolean {
  return score !== null && score >= 5 && score < 6;
}

export const gradeColors: Record<Grade, { text: string; bg: string }> = {
  A: { text: 'text-emerald-600', bg: 'bg-emerald-50' },
  B: { text: 'text-blue-600', bg: 'bg-blue-50' },
  C: { text: 'text-amber-600', bg: 'bg-amber-50' },
  D: { text: 'text-orange-600', bg: 'bg-orange-50' },
  E: { text: 'text-orange-700', bg: 'bg-orange-100' },
  F: { text: 'text-red-600', bg: 'bg-red-50' },
};