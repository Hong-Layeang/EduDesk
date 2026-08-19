export type EnvironmentVariables = {
  NODE_ENV: 'development' | 'staging' | 'production' | 'test';
  PORT: number;

  // Database
  DATABASE_URL?: string;
  DB_HOST?: string;
  DB_PORT?: number;
  DB_USERNAME?: string;
  DB_PASSWORD?: string;
  DB_NAME?: string;

  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  // Redis
  REDIS_URL?: string;
  REDIS_HOST?: string;
  REDIS_PORT?: number;
  REDIS_PASSWORD?: string;
  CACHE_TTL?: number;

  // Throttler
  THROTTLE_TTL_MS?: number;
  THROTTLE_LIMIT_DEFAULT?: number;

  // CORS / Proxy
  CORS_ALLOWED_ORIGINS?: string;
  TRUST_PROXY?: string;
};
