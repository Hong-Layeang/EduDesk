import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().default(3000),

  // Database
  DATABASE_URL: Joi.string().optional(),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('postgres'),
  DB_NAME: Joi.string().default('edudesk_db'),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  // Redis
  REDIS_URL: Joi.string().optional(),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional().allow(''),
  CACHE_TTL: Joi.number().default(300),

  // Throttler
  THROTTLE_TTL_MS: Joi.number().default(60000),
  THROTTLE_LIMIT_DEFAULT: Joi.number().default(100),

  // CORS / Proxy
  CORS_ALLOWED_ORIGINS: Joi.string().optional().allow(''),
  TRUST_PROXY: Joi.string().optional().allow(''),
});
