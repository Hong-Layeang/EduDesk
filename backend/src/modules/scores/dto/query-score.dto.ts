import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { ScorePeriodType } from '../entities/score.entity';

export class QueryScoreDto {
  @ApiProperty({ example: '6a' })
  @IsString()
  @MaxLength(20)
  classId!: string;

  @ApiPropertyOptional({ enum: ScorePeriodType, example: ScorePeriodType.SEMESTER1 })
  @IsOptional()
  @IsEnum(ScorePeriodType)
  periodType?: ScorePeriodType;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(12)
  periodKey?: number;
}