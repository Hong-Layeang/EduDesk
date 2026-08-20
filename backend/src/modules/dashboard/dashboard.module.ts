import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ClassesModule } from '../classes/classes.module';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [ClassesModule, StudentsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}