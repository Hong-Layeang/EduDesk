import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { Gender } from '../entities/student.entity';

export class CreateStudentDto {
  @ApiProperty({ example: 'ចាន់ ដារា' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  khmerName!: string;

  @ApiProperty({ example: 'Chan Dara' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  englishName!: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender!: Gender;

  @ApiProperty({ example: '6a', description: 'Stable class key used for filtering' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  classId!: string;

  @ApiProperty({ example: 'ថ្នាក់ទី៦ក', description: 'Human-readable class label' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  className!: string;

  @ApiProperty({ example: '001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  rollNumber!: string;

  @ApiPropertyOptional({ example: 'https://i.pravatar.cc/150?img=12' })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  avatarUrl?: string;
}