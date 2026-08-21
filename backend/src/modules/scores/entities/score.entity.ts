import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';

export enum Subject {
  KHMER = 'khmer',
  MATH = 'math',
  SCIENCE = 'science',
  HISTORY = 'history',
  CIVICS = 'civics',
  PE = 'pe',
}

export enum ScorePeriodType {
  MONTHLY = 'monthly',
  SEMESTER1 = 'semester1',
  SEMESTER2 = 'semester2',
}

@Entity('scores')
@Unique('UQ_score_unique_entry', ['studentId', 'subject', 'periodType', 'periodKey'])
export class Score {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'student_id', type: 'uuid' })
  studentId!: string;

  @Index()
  @Column({ name: 'class_id', length: 20 })
  classId!: string;

  @Column({ type: 'enum', enum: Subject })
  subject!: Subject;

  @Column({ name: 'period_type', type: 'enum', enum: ScorePeriodType })
  periodType!: ScorePeriodType;

  // 1-12 for monthly (calendar month), 0 for semester1/semester2
  @Column({ name: 'period_key', type: 'smallint', default: 0 })
  periodKey!: number;

  @Column({ type: 'numeric', precision: 4, scale: 2 })
  score!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}