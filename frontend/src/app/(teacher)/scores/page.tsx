'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useScoresStore } from '@/features/scores/store/scores.store';
import { ScoreClassTabs } from '@/features/scores/components/ScoreClassTabs';
import { PeriodTabs } from '@/features/scores/components/PeriodTabs';
import { MonthPills } from '@/features/scores/components/MonthPills';
import { SubjectTabs } from '@/features/scores/components/SubjectTabs';
import { StatusFilterPills } from '@/features/scores/components/StatusFilterPills';
import { ScoreListItem } from '@/features/scores/components/ScoreListItem';
import { StudentCardSkeleton } from '@/features/students/components/StudentCardSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { AVERAGE_KEY } from '@/config/subjects';
import { isFailed, isNearFail } from '@/utils/grade';
import type { SubjectKey } from '@/config/subjects';
import type { StatusFilter } from '@/config/scorePeriods';

export default function ScoresPage() {
  const {
    classes,
    activeClassId,
    periodType,
    monthKey,
    students,
    scores,
    isLoadingClasses,
    isLoadingScores,
    savingKey,
    error,
    init,
    setActiveClass,
    setPeriodType,
    setMonthKey,
    updateScore,
  } = useScoresStore();

  const [subjectTab, setSubjectTab] = useState<SubjectKey | typeof AVERAGE_KEY>('khmer');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editable = periodType !== 'annual' && subjectTab !== AVERAGE_KEY;

  const rows = useMemo(() => {
    const withScores = students.map((student) => {
      const subjectScores = scores[student.id] ?? {};
      let score: number | null;

      if (subjectTab === AVERAGE_KEY) {
        const values = Object.values(subjectScores).filter(
          (v): v is number => v !== null && v !== undefined,
        );
        score = values.length
          ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100
          : null;
      } else {
        score = subjectScores[subjectTab] ?? null;
      }

      return { student, score };
    });

    const filtered = withScores.filter(({ score }) => {
      if (statusFilter === 'failed') return isFailed(score);
      if (statusFilter === 'nearFail') return isNearFail(score);
      return true;
    });

    return filtered.sort((a, b) => {
      if (a.score === null && b.score === null) return 0;
      if (a.score === null) return 1;
      if (b.score === null) return -1;
      return b.score - a.score;
    });
  }, [students, scores, subjectTab, statusFilter]);

  const isLoading = isLoadingClasses || isLoadingScores;

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-0 z-10 space-y-3 border-b border-slate-100 bg-slate-50/95 px-4 pb-4 pt-5 backdrop-blur">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ពិន្ទុ</h1>
          <p className="text-xs text-slate-400">គ្រប់គ្រងពិន្ទុសិស្សតាមមុខវិជ្ជា និងតាមកំឡុងពេល</p>
        </div>

        {isLoadingClasses && classes.length === 0 ? (
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 w-20 shrink-0 animate-pulse rounded-full bg-slate-200" />
            ))}
          </div>
        ) : (
          <ScoreClassTabs classes={classes} activeClassId={activeClassId} onSelect={setActiveClass} />
        )}

        <PeriodTabs value={periodType} onChange={setPeriodType} />

        {periodType === 'monthly' && <MonthPills value={monthKey} onChange={setMonthKey} />}

        <SubjectTabs value={subjectTab} onChange={setSubjectTab} />

        <StatusFilterPills value={statusFilter} onChange={setStatusFilter} />
      </div>

      <div className="flex-1 space-y-3 px-4 pb-6 pt-4">
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </span>
            <button
              type="button"
              onClick={() => void init()}
              className="flex shrink-0 items-center gap-1 font-medium underline underline-offset-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              ព្យាយាមម្ដងទៀត
            </button>
          </div>
        )}

        {periodType === 'annual' && (
          <p className="rounded-xl bg-primary/5 px-3 py-2 text-xs text-primary">
            ពិន្ទុប្រចាំឆ្នាំត្រូវបានគណនាដោយស្វ័យប្រវត្តិ (មធ្យមភាគនៃឆមាសទី១ និងឆមាសទី២) មិនអាចកែសម្រួលបានទេ
          </p>
        )}

        {subjectTab === AVERAGE_KEY && periodType !== 'annual' && (
          <p className="rounded-xl bg-primary/5 px-3 py-2 text-xs text-primary">
            មធ្យមភាគត្រូវបានគណនាដោយស្វ័យប្រវត្តិពីមុខវិជ្ជាទាំងអស់ មិនអាចកែសម្រួលបានទេ
          </p>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StudentCardSkeleton key={i} />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState title="រកមិនឃើញសិស្សទេ" description="សូមផ្លាស់ប្ដូរតម្រង ឬជ្រើសរើសថ្នាក់ផ្សេង" />
        ) : (
          <div className="space-y-3">
            {rows.map(({ student, score }, index) => (
              <ScoreListItem
                key={student.id}
                rank={index + 1}
                student={student}
                score={score}
                editable={editable}
                isSaving={subjectTab !== AVERAGE_KEY && savingKey === `${student.id}:${subjectTab}`}
                onSave={(value) => {
                  if (subjectTab === AVERAGE_KEY) return;
                  void updateScore(student.id, subjectTab, value);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}