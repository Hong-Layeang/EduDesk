import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryStudentDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'dara', description: 'Matches Khmer or English name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ example: '6a' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  classId?: string;
}