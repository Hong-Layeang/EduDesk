import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { DataSource } from 'typeorm';

import { AppModule } from './app.module';
import { EnvironmentVariables } from './common/types/env';
import { AppLogger } from './common/services/app-logger.service';
import { renderLogs } from './common/utils/render-logs';
import { documentBuilderOptions } from './config/swagger/options';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Use our custom logger for all NestJS internal logs
  app.useLogger(app.get(AppLogger));

  // Enable OnApplicationShutdown lifecycle hooks (required for AppLogger stream close)
  app.enableShutdownHooks();

  app.set('query parser', 'extended');
  app.setGlobalPrefix('api/v1', {
    exclude: ['/', 'health', 'docs', 'docs/*path'],
  });

  const configService = app.get(ConfigService<EnvironmentVariables>);
  const trustProxy = parseTrustProxy(configService.get('TRUST_PROXY'));
  if (trustProxy !== undefined) {
    app.set('trust proxy', trustProxy);
  }

  app.use(helmet());
  app.use(cookieParser());
  configureCors(app, configService);

  const swaggerPrefix = 'docs';
  const isProduction = configService.get('NODE_ENV') === 'production';
  SwaggerModule.setup(
    swaggerPrefix,
    app,
    () => SwaggerModule.createDocument(app, documentBuilderOptions),
    {
      swaggerOptions: { persistAuthorization: true },
      ui: !isProduction,
      raw: !isProduction,
    },
  );

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  const databaseStatus = checkDatabaseConnection(app);
  const redisStatus = await checkRedisConnection(app, configService);

  renderLogs(app, swaggerPrefix, databaseStatus, redisStatus);
}

function checkDatabaseConnection(app: NestExpressApplication): string | undefined {
  const logger = app.get(AppLogger);
  try {
    const dataSource = app.get(DataSource);
    if (!dataSource.isInitialized) return 'Not initialized';

    const options = dataSource.options as { database?: string; url?: string };
    let dbName = options.database;
    if (!dbName && options.url) {
      const match = options.url.match(/\/([^/?]+)(\?.*)?$/);
      dbName = match?.[1] ?? 'unknown';
    }
    return `Connected — postgres (${dbName ?? 'unknown'})`;
  } catch (error) {
    logger.error(`DB check failed: ${(error as Error).message}`);
    return 'Connection check failed';
  }
}

async function checkRedisConnection(
  app: NestExpressApplication,
  configService: ConfigService<EnvironmentVariables>,
): Promise<string | undefined> {
  const logger = app.get(AppLogger);
  const cacheManager = app.get<Cache>(CACHE_MANAGER);
  try {
    const redisHost = configService.get<string>('REDIS_HOST') ?? 'localhost';
    const redisPort = configService.get<number>('REDIS_PORT') ?? 6379;
    const redisUrl = configService.get<string>('REDIS_URL') ?? `redis://${redisHost}:${redisPort}`;
    const sanitizedUrl = redisUrl.replace(/\/\/[^:]*:[^@]+@/, '//***:***@');

    const testKey = 'redis:health:check';
    await cacheManager.set(testKey, { ok: true }, 5000);
    const retrieved = await cacheManager.get(testKey);
    if (retrieved) {
      await cacheManager.del(testKey);
      return `Connected — ${sanitizedUrl}`;
    }
    return 'Connection test failed';
  } catch (error) {
    logger.error(`Redis check failed: ${(error as Error).message}`);
    return 'Connection failed';
  }
}

void bootstrap();

function parseTrustProxy(raw?: string): boolean | number | undefined {
  if (!raw) return undefined;
  const normalized = raw.trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseAllowedOrigins(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((o) => o.trim())
    .filter((o) => o.length > 0);
}

function configureCors(
  app: NestExpressApplication,
  configService: ConfigService<EnvironmentVariables>,
): void {
  const isProduction = configService.get('NODE_ENV') === 'production';
  const allowedOrigins = parseAllowedOrigins(configService.get('CORS_ALLOWED_ORIGINS'));

  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (!isProduction && allowedOrigins.length === 0) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  });
}
