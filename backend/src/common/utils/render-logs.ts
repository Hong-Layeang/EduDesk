import { INestApplication } from '@nestjs/common';
import { AppLogger } from '../services/app-logger.service';

export function renderLogs(
  app: INestApplication,
  swaggerPrefix: string,
  databaseStatus?: string,
  redisStatus?: string,
): void {
  const logger = app.get(AppLogger);
  const port = process.env.PORT || 3000;

  logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  logger.log(` EduDesk API`);
  logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  logger.log(` API:     http://localhost:${port}/api/v1`);
  logger.log(` Swagger: http://localhost:${port}/${swaggerPrefix}`);
  if (databaseStatus) logger.log(` DB:      ${databaseStatus}`);
  if (redisStatus) logger.log(` Redis:   ${redisStatus}`);
  logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}
