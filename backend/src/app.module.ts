import { ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';

import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { EnvironmentVariables } from './common/types/env';
import {
  appConfig,
  jwtConfig,
  cacheConfig,
  createThrottlerOptions,
  validationSchema,
} from './config';
import { LoggingInterceptor, ResponseInterceptor } from './common/interceptors';
import { AllExceptionsFilter } from './common/interceptors/catch-everything';
import { AppThrottlerGuard } from './common/guards';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: false,
      load: [appConfig, jwtConfig, cacheConfig],
      validationSchema,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        const redisHost = configService.get<string>('REDIS_HOST', 'localhost');
        const redisPort = configService.get<number>('REDIS_PORT', 6379);
        const redisPassword = configService.get<string>('REDIS_PASSWORD');

        const finalRedisUrl =
          redisUrl ||
          `redis://${redisPassword ? `:${redisPassword}@` : ''}${redisHost}:${redisPort}`;

        const keyvRedis = new KeyvRedis(finalRedisUrl, { useUnlink: true });
        keyvRedis.on('error', (err: Error) => {
          console.warn(`[Cache] Redis error (non-fatal): ${err.message}`);
        });

        const keyvStore = new Keyv({ store: keyvRedis, namespace: 'edudesk' });
        const ttlMs = configService.get<number>('CACHE_TTL', 300) * 1000;

        return { ttl: ttlMs, stores: [keyvStore] };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: createThrottlerOptions,
      inject: [ConfigService],
    }),
    DatabaseModule,
    CommonModule,
    CategoriesModule,
    // More feature modules go here:
    // UsersModule,
    // MenuModule,
    // OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    // Filter — must come first so it catches errors from guards, pipes, interceptors
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // Pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    // Guards
    // JwtAuthGuard is scaffolded — enable here once auth module is implemented:
    // { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
    // Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
