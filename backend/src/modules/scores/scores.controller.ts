import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScoresService } from './scores.service';
import { UpsertScoreDto } from './dto/upsert-score.dto';
import { QueryScoreDto } from './dto/query-score.dto';
import { Public } from '../../common/decorators';
import { ScorePeriodType } from './entities/score.entity';

@ApiTags('Scores')
@ApiBearerAuth()
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get scores for a class within a period (monthly/semester1/semester2)' })
  findForPeriod(@Query() query: QueryScoreDto) {
    return this.scoresService.findForPeriod(
      query.classId,
      query.periodType ?? ScorePeriodType.SEMESTER1,
      query.periodKey ?? 0,
    );
  }

  @Public()
  @Get('annual')
  @ApiOperation({ summary: 'Get computed annual scores (average of semester 1 & 2) for a class' })
  findAnnual(@Query('classId') classId: string) {
    return this.scoresService.findAnnual(classId);
  }

  @Put()
  @ApiOperation({ summary: 'Create or update a single score entry (min 0, max 10)' })
  upsert(@Body() dto: UpsertScoreDto) {
    return this.scoresService.upsert(dto);
  }
}