export type PeriodType = 'monthly' | 'semester1' | 'semester2' | 'annual';

export interface PeriodTab {
  key: PeriodType;
  label: string;
}

// Edit these labels to match your exact report-card wording — nothing else
// in the app needs to change.
export const PERIOD_TABS: PeriodTab[] = [
  { key: 'monthly', label: 'ប្រចាំខែ' },
  { key: 'semester1', label: 'ឆមាសទី១' },
  { key: 'semester2', label: 'ឆមាសទី២' },
  { key: 'annual', label: 'ប្រចាំឆ្នាំ' },
];

export interface MonthOption {
  key: number;
  label: string;
}

// Cambodia's academic year runs October → August, so months are ordered
// to match (consistent with utils/academicYear.ts).
export const MONTHS: MonthOption[] = [
  { key: 10, label: 'តុលា' },
  { key: 11, label: 'វិច្ឆិកា' },
  { key: 12, label: 'ធ្នូ' },
  { key: 1, label: 'មករា' },
  { key: 2, label: 'កុម្ភៈ' },
  { key: 3, label: 'មីនា' },
  { key: 4, label: 'មេសា' },
  { key: 5, label: 'ឧសភា' },
  { key: 6, label: 'មិថុនា' },
  { key: 7, label: 'កក្កដា' },
  { key: 8, label: 'សីហា' },
];

export type StatusFilter = 'all' | 'failed' | 'nearFail';

export interface StatusFilterOption {
  key: StatusFilter;
  label: string;
}

export const STATUS_FILTERS: StatusFilterOption[] = [
  { key: 'all', label: 'ទាំងអស់' },
  { key: 'failed', label: 'ធ្លាក់' },
  { key: 'nearFail', label: 'ជិតធ្លាក់' },
];