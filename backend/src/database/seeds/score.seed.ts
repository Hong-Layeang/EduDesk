import { DataSource } from 'typeorm';
import { Score, ScorePeriodType, Subject } from '../../modules/scores/entities/score.entity';
import { Student } from '../../modules/students/entities/student.entity';

// A few purposefully low/borderline values are included per subject so the
// "failed" / "near fail" highlighting can be seen immediately after seeding.
const SUBJECT_SCORE_PLAN: Record<Subject, number[]> = {
  [Subject.KHMER]: [8.5, 9.0, 4.5, 7.0, 6.5, 3.5, 8.0, 9.5, 6.0, 7.5, 5.5, 8.0],
  [Subject.MATH]: [7.0, 8.5, 5.0, 6.5, 7.5, 4.0, 9.0, 8.0, 5.5, 6.0, 7.0, 9.5],
  [Subject.SCIENCE]: [8.0, 7.5, 4.0, 8.5, 6.0, 5.0, 7.5, 9.0, 6.5, 8.0, 6.0, 7.0],
  [Subject.HISTORY]: [9.0, 6.5, 3.0, 7.0, 8.0, 4.5, 8.5, 7.0, 7.5, 5.0, 8.0, 9.0],
  [Subject.CIVICS]: [7.5, 8.0, 5.5, 6.0, 9.0, 3.0, 6.5, 8.5, 6.0, 7.0, 5.0, 8.5],
  [Subject.PE]: [9.5, 9.0, 6.0, 8.0, 8.5, 5.0, 9.0, 8.5, 7.5, 8.0, 7.0, 9.0],
};

export async function seedScores(dataSource: DataSource): Promise<void> {
  const scoreRepo = dataSource.getRepository(Score);
  const studentRepo = dataSource.getRepository(Student);

  const students = await studentRepo.find({ order: { classId: 'ASC', rollNumber: 'ASC' } });
  if (students.length === 0) {
    console.log('  ⚠ scores skipped — no students found, run student seed first');
    return;
  }

  const rows: Partial<Score>[] = [];
  students.forEach((student, index) => {
    (Object.keys(SUBJECT_SCORE_PLAN) as Subject[]).forEach((subject) => {
      const plan = SUBJECT_SCORE_PLAN[subject];
      const score = plan[index % plan.length];
      rows.push({
        studentId: student.id,
        classId: student.classId,
        subject,
        periodType: ScorePeriodType.SEMESTER1,
        periodKey: 0,
        score,
      });
    });
  });

  await scoreRepo.upsert(rows, {
    conflictPaths: ['studentId', 'subject', 'periodType', 'periodKey'],
    skipUpdateIfNoValuesChanged: true,
  });

  console.log(`  ✔ scores seeded (${rows.length} records)`);
}