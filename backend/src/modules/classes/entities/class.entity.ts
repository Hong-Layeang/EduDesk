/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ name: 'class_id', length: 20 })
  classId!: string;

  @Column({ name: 'grade_label', length: 50 })
  gradeLabel!: string;

  @Column({ name: 'class_name', length: 50 })
  className!: string;

  @Column({ name: 'thumbnail_url', nullable: true, length: 500 })
  thumbnailUrl!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}