import { toKhmerNumeral } from './khmerNumerals';

/**
 * Cambodia's school year generally runs from October to August.
 * Before October, we're still in the previous academic year.
 */
export function getCurrentAcademicYearLabel(date: Date = new Date()): string {
  const month = date.getMonth(); // 0 = January
  const year = date.getFullYear();

  const startYear = month >= 9 ? year : year - 1;
  const endYear = startYear + 1;

  return `ឆ្នាំសិក្សា ${toKhmerNumeral(startYear)}–${toKhmerNumeral(endYear)}`;
}