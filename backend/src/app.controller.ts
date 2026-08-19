import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators';

@ApiTags('root')
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Health ping' })
  getRoot() {
    return { message: 'EduDesk API is running' };
  }
}
