import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async get<T = unknown>(key: string): Promise<T | null> {
    try {
      return (await this.cacheManager.get<T>(key)) ?? null;
    } catch (err) {
      this.logger.warn(`Redis GET failed (${key}): ${(err as Error).message}`);
      return null;
    }
  }

  async set(key: string, value: unknown, ttl: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (err) {
      this.logger.warn(`Redis SET failed (${key}): ${(err as Error).message}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (err) {
      this.logger.warn(`Redis DEL failed (${key}): ${(err as Error).message}`);
    }
  }

  async getVersion(versionKey: string): Promise<number> {
    return (await this.get<number>(versionKey)) ?? 1;
  }

  async bumpVersion(versionKey: string, ttl: number): Promise<void> {
    const current = await this.getVersion(versionKey);
    await this.set(versionKey, current + 1, ttl);
  }
}
