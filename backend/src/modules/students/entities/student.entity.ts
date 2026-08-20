import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'khmer_name', length: 100 })
  khmerName!: string;

  @Index()
  @Column({ name: 'english_name', length: 100 })
  englishName!: string;

  @Column({ type: 'enum', enum: Gender })
  gender!: Gender;

  @Index()
  @Column({ name: 'class_id', length: 20 })
  classId!: string;

  @Column({ name: 'class_name', length: 50 })
  className!: string;

  @Column({ name: 'roll_number', length: 20 })
  rollNumber!: string;

  @Column({ name: 'avatar_url', nullable: true, length: 500 })
  avatarUrl!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}