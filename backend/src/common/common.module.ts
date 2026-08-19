import { Global, Module } from '@nestjs/common';
import { AppLogger } from './services/app-logger.service';
import { CacheService } from './services/cache.service';

@Global()
@Module({
  providers: [AppLogger, CacheService],
  exports: [AppLogger, CacheService],
})
export class CommonModule {}
