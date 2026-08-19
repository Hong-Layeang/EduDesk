import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { EnvironmentVariables } from '../common/types/env';

export const createThrottlerOptions = (
  configService: ConfigService<EnvironmentVariables>,
): ThrottlerModuleOptions => {
  const ttl = Number(configService.get('THROTTLE_TTL_MS', 60000));
  const limit = Number(configService.get('THROTTLE_LIMIT_DEFAULT', 100));
  const redisOptions = buildRedisOptions(configService);

  return {
    throttlers: [{ name: 'default', ttl, limit }],
    storage: redisOptions ? new ThrottlerStorageRedisService(redisOptions) : undefined,
  };
};

const buildRedisOptions = (
  configService: ConfigService<EnvironmentVariables>,
): Record<string, unknown> | undefined => {
  const redisUrl = configService.get<string>('REDIS_URL');

  if (redisUrl) {
    const parsed = new URL(redisUrl);
    const dbFromPath = parsed.pathname?.replace('/', '');
    const db = dbFromPath && /^\d+$/.test(dbFromPath) ? Number(dbFromPath) : undefined;

    return {
      host: parsed.hostname,
      port: Number(parsed.port || '6379'),
      username: parsed.username || undefined,
      password: parsed.password || undefined,
      db,
      tls: parsed.protocol === 'rediss:' ? {} : undefined,
    };
  }

  return {
    host: configService.get<string>('REDIS_HOST', 'localhost'),
    port: Number(configService.get<number>('REDIS_PORT', 6379)),
    password: configService.get<string>('REDIS_PASSWORD') || undefined,
  };
};
