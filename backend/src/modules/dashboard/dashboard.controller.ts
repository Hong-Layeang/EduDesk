import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Public } from '../../common/decorators';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Aggregate stats for the teacher home screen' })
  getStats() {
    return this.dashboardService.getStats();
  }

  @Public()
  @Get('classes')
  @ApiOperation({ summary: 'Class summaries with live student counts' })
  getClasses() {
    return this.dashboardService.getClassSummaries();
  }
}