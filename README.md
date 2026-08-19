# EduDesk

Teacher administrative platform for Cambodian teachers managing Grades 0–6. The platform will centralize teacher, class, student, academic, calculation, and administrative report data, with professional Excel documents as a primary output format.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 (SWC compiler) |
| Language | TypeScript 5 |
| Database | PostgreSQL 14+ via TypeORM 0.3 |
| Cache | Redis 7+ via Keyv + cache-manager |
| Auth | JWT + Passport (scaffolded) |
| Validation | class-validator + class-transformer |
| Docs | Swagger / OpenAPI |
| Package manager | pnpm |

---

## Repository Structure

```
EduDesk/
├── backend/          ← NestJS API
└── docs/             ← Project-level documentation
```

---

## Prerequisites

- Node.js >= 20
- pnpm >= 10
- PostgreSQL >= 14
- Redis >= 7

---

## Getting Started

```bash
cd backend

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env — set DB_PASSWORD, DB_NAME, JWT_SECRET

# Create the database (first time only)
psql -U postgres -c "CREATE DATABASE edudesk_db;"

# Run migrations
pnpm migration:run

# Seed initial data (optional)
pnpm seed

# Start development server
pnpm start:dev
```

| Endpoint | URL |
|---|---|
| API base | `http://localhost:3000/api/v1` |
| Swagger docs | `http://localhost:3000/docs` |

---

## Available Scripts

```bash
pnpm start:dev          # Development server with hot reload and type checking
pnpm build              # Production build
pnpm lint               # ESLint with auto-fix
pnpm format             # Prettier formatting
pnpm test               # Unit tests
pnpm test:cov           # Unit tests with coverage report

pnpm migration:generate src/migrations/Name   # Generate migration from entity changes
pnpm migration:run                            # Apply pending migrations
pnpm migration:revert                         # Undo last migration
pnpm migration:show                           # List applied migrations

pnpm seed               # Run database seeders
```

---

## Project Architecture

### Global Request Pipeline

Every request passes through the following layers in order before reaching a controller:

```
Request
  AppThrottlerGuard           rate limiting
  LoggingInterceptor          logs method, path, status, duration
  ResponseInterceptor         wraps response in standard envelope
  ClassSerializerInterceptor  applies @Exclude / @Expose decorators
  AllExceptionsFilter         catches all errors, returns clean JSON
  ValidationPipe              validates DTO with class-validator
  Controller / Service
```

All layers are registered globally via `APP_FILTER`, `APP_PIPE`, `APP_GUARD`, and `APP_INTERCEPTOR` tokens — dependency injection is fully supported.

### Module Structure

Every feature module follows this layout:

```
modules/<name>/
  entities/
    <name>.entity.ts
  dto/
    create-<name>.dto.ts
    update-<name>.dto.ts
  <name>.controller.ts
  <name>.controller.spec.ts
  <name>.service.ts
  <name>.service.spec.ts
  <name>.module.ts
```

### Standard Response Envelope

All responses are wrapped automatically by `ResponseInterceptor`:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {},
  "timestamp": "2026-06-04T14:00:00.000Z"
}
```

Paginated responses include a `meta` field:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [],
  "timestamp": "...",
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

### Caching Strategy

Redis caching is applied at the service layer using `CACHE_MANAGER` from `@nestjs/cache-manager`. All cache operations use resilient helpers — a Redis failure is treated as a cache miss and never crashes a request.

List queries use a version-bump invalidation strategy: instead of scanning or deleting individual list keys, a version counter is incremented on every write. Existing list cache keys become unreachable instantly.

Key format:

```
<resource>:<id>                          single record  — TTL 10 min
<resource>:list:v<version>:p<n>:l<n>     paginated list — TTL 5 min
<resource>:version                       version key    — TTL 24 h
```

### Database

- Migrations only — `synchronize` is always `false`
- Connection: `DATABASE_URL` (production/staging) or individual `DB_*` vars (development)
- `src/database/data-source.ts` is the TypeORM CLI data source for migration commands
- Seeds use `upsert` with conflict paths — safe to run multiple times

### Authentication

`JwtAuthGuard` is scaffolded in `common/guards/` and ready to be wired. To enable globally, uncomment the `APP_GUARD` entry in `app.module.ts`. Routes that must remain public after auth is enabled use the `@Public()` decorator.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | `development` or `production` |
| `PORT` | No | HTTP port (default: `3000`) |
| `DATABASE_URL` | No | Full Postgres connection URL — overrides `DB_*` vars |
| `DB_HOST` | Yes* | Postgres host |
| `DB_PORT` | Yes* | Postgres port |
| `DB_USERNAME` | Yes* | Postgres username |
| `DB_PASSWORD` | Yes* | Postgres password |
| `DB_NAME` | Yes* | Database name |
| `JWT_SECRET` | Yes | Long random string — change before deploying |
| `JWT_EXPIRES_IN` | No | Token expiry (default: `7d`) |
| `REDIS_HOST` | No | Redis host (default: `localhost`) |
| `REDIS_PORT` | No | Redis port (default: `6379`) |
| `REDIS_PASSWORD` | No | Redis password if auth is enabled |
| `CACHE_TTL` | No | Default cache TTL in seconds (default: `300`) |
| `THROTTLE_TTL_MS` | No | Rate limit window in ms (default: `60000`) |
| `THROTTLE_LIMIT_DEFAULT` | No | Max requests per window (default: `100`) |
| `CORS_ALLOWED_ORIGINS` | No | Comma-separated allowed origins — empty allows all in development |
| `TRUST_PROXY` | No | `true`, `false`, or hop count |

*Required when `DATABASE_URL` is not set.*

---

## Developer Documentation

See [`backend/docs/DEVELOPER_GUIDE.md`](backend/docs/DEVELOPER_GUIDE.md) for the full developer guide covering:

- How to create a new module (step by step)
- How to write migrations and seeds
- How to use the caching pattern
- How to write unit tests
- Common mistakes to avoid

---

## License

Private — all rights reserved.
