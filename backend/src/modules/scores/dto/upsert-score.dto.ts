import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { Subject, ScorePeriodType } from '../entities/score.entity';

export class UpsertScoreDto {
  @ApiProperty({ example: 'b3f1c2e4-1234-4a5b-9c3d-abcdef123456' })
  @IsUUID()
  studentId!: string;

  @ApiProperty({ example: '6a' })
  @IsString()
  @MaxLength(20)
  classId!: string;

  @ApiProperty({ enum: Subject, example: Subject.KHMER })
  @IsEnum(Subject)
  subject!: Subject;

  @ApiProperty({ enum: ScorePeriodType, example: ScorePeriodType.SEMESTER1 })
  @IsEnum(ScorePeriodType)
  periodType!: ScorePeriodType;

  @ApiProperty({ example: 0, description: '1-12 for monthly, 0 for semester1/semester2' })
  @IsInt()
  @Min(0)
  @Max(12)
  periodKey!: number;

  @ApiProperty({ example: 8.5, minimum: 0, maximum: 10 })
  @IsNumber()
  @Min(0)
  @Max(10)
  score!: number;
}