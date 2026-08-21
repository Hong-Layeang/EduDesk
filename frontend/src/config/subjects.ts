export type SubjectKey = 'khmer' | 'math' | 'science' | 'history' | 'civics' | 'pe';

export interface SubjectOption {
  key: SubjectKey;
  label: string;
}

export const SUBJECTS: SubjectOption[] = [
  { key: 'khmer', label: 'ខ្មែរ' },
  { key: 'math', label: 'គណិតវិទ្យា' },
  { key: 'science', label: 'វិទ្យាសាស្ត្រ' },
  { key: 'history', label: 'ប្រវត្តិវិទ្យា' },
  { key: 'civics', label: 'សីលធម៌-ពលរដ្ឋ' },
  { key: 'pe', label: 'អប់រំកាយ' },
];

// Pseudo-subject: system-calculated average across all subjects above.
export const AVERAGE_KEY = 'average';