# EduDesk — Backend Developer Guide

> Read this before writing any code. It covers everything you need to know to work on this project.

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Project Structure](#2-project-structure)
3. [How a Request Travels Through the App](#3-how-a-request-travels-through-the-app)
4. [How to Create a New Module](#4-how-to-create-a-new-module)
5. [Database — Migrations](#5-database--migrations)
6. [Database — Seeds](#6-database--seeds)
7. [Caching with Redis](#7-caching-with-redis)
8. [How to Write Unit Tests](#8-how-to-write-unit-tests)
9. [Environment Variables Reference](#9-environment-variables-reference)
10. [Standard Response Envelope](#10-standard-response-envelope)
11. [Common Mistakes to Avoid](#11-common-mistakes-to-avoid)

---

## 1. Project Setup

### Requirements

| Tool | Version |
|------|---------|
| Node.js | >= 20 |
| pnpm | >= 10 |
| PostgreSQL | >= 14 |
| Redis | >= 7 |

> **Always use `pnpm`. Never `npm` or `yarn`.** The project enforces this at install time.

### First-time setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy the env file and fill in your values
cp .env.example .env
# Edit .env — set DB_PASSWORD, DB_NAME, JWT_SECRET

# 3. Create the database (first time only)
psql -U postgres -c "CREATE DATABASE edudesk_db;"

# 4. Run migrations to create tables
pnpm migration:run

# 5. Seed initial data (optional)
pnpm seed

# 6. Start the dev server
pnpm start:dev
```

The server starts at `http://localhost:3000`.
Swagger API docs are at `http://localhost:3000/docs`.

---

## 2. Project Structure

```
src/
├── app.module.ts          ← Root module — wires everything together
├── main.ts                ← Bootstrap — server startup, global config
│
├── common/                ← Shared code used across all modules
│   ├── constants/         ← App-wide constants (e.g. IS_PUBLIC_KEY)
│   ├── decorators/        ← @Public(), @CurrentUser()
│   ├── dto/               ← Shared DTOs (e.g. PaginationQueryDto)
│   ├── guards/            ← AppThrottlerGuard, JwtAuthGuard (scaffolded)
│   ├── interceptors/      ← LoggingInterceptor, ResponseInterceptor, AllExceptionsFilter
│   ├── services/          ← AppLogger
│   ├── types/             ← TypeScript types (env vars, TypeORM errors)
│   └── utils/             ← renderLogs (startup banner)
│
├── config/                ← App configuration (loaded via ConfigModule)
│   ├── app.config.ts
│   ├── cache.config.ts
│   ├── jwt.config.ts
│   ├── throttler.config.ts
│   ├── validation.schema.ts  ← Joi env validation — bad config = app won't start
│   └── swagger/options.ts
│
├── database/
│   ├── database.module.ts    ← TypeORM connection setup
│   ├── data-source.ts        ← Used by TypeORM CLI (migrations only)
│   └── seeds/                ← Seed scripts
│
├── migrations/               ← Database migration files (auto-generated)
│
└── modules/                  ← Feature modules go here
    └── categories/           ← Example — copy this for every new module
        ├── entities/
        │   └── category.entity.ts
        ├── dto/
        │   ├── create-category.dto.ts
        │   └── update-category.dto.ts
        ├── categories.controller.ts
        ├── categories.controller.spec.ts
        ├── categories.service.ts
        ├── categories.service.spec.ts
        └── categories.module.ts
```

---

## 3. How a Request Travels Through the App

Every HTTP request goes through these layers **in order**:

```
Request
  │
  ▼
AppThrottlerGuard       ← Blocks if too many requests (rate limiting)
  │
  ▼
LoggingInterceptor      ← Logs: METHOD /path STATUS - Xms
  │
  ▼
ResponseInterceptor     ← Wraps your return value in the standard envelope
  │
  ▼
ClassSerializerInterceptor  ← Applies @Exclude() / @Expose() from class-transformer
  │
  ▼
AllExceptionsFilter     ← Catches any error and returns a clean JSON response
  │
  ▼
ValidationPipe          ← Validates request body/query against your DTO class
  │
  ▼
Your Controller method
  │
  ▼
Your Service
  │
  ▼
Response (automatically wrapped)
```

**You do not need to configure any of this yourself.** It is already wired globally. You just write your controller and service.

---

## 4. How to Create a New Module

This is the most important section. Follow these steps every time.

### Step 1 — Generate the files

```bash
nest g module modules/products
nest g controller modules/products --no-spec
nest g service modules/products --no-spec
```

Then create the folders manually:

```bash
mkdir src/modules/products/entities
mkdir src/modules/products/dto
```

### Step 2 — Create the entity

`src/modules/products/entities/product.entity.ts`

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 150 })
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ nullable: true, length: 500 })
  description!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
```

### Step 3 — Create DTOs

`src/modules/products/dto/create-product.dto.ts`

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Fried Rice' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ApiProperty({ example: 5.50 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price!: number;

  @ApiPropertyOptional({ example: 'Served with vegetables' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
```

`src/modules/products/dto/update-product.dto.ts`

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

### Step 4 — Wire the entity into the module

`src/modules/products/products.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
```

### Step 5 — Register the entity in data-source.ts (for migrations)

Open `src/database/data-source.ts` and add your entity:

```typescript
import { Category } from '../modules/categories/entities/category.entity';
import { Product } from '../modules/products/entities/product.entity'; // ← add this

const entities = [Category, Product]; // ← add here
```

### Step 6 — Register the module in app.module.ts

Open `src/app.module.ts` and add:

```typescript
import { ProductsModule } from './modules/products/products.module';

// inside @Module imports array:
ProductsModule,
```

### Step 7 — Generate and run the migration

```bash
pnpm migration:generate src/migrations/CreateProductsTable
pnpm migration:run
```

### Step 8 — Write the controller and service

Copy the pattern from `src/modules/categories/`. The structure is identical for every module.

---

## 5. Database — Migrations

> **Rule: Never change the database schema without a migration.** `synchronize` is always `false`.

```bash
# Generate a migration from entity changes
pnpm migration:generate src/migrations/YourMigrationName

# Apply all pending migrations
pnpm migration:run

# Undo the last migration
pnpm migration:revert

# See which migrations have run
pnpm migration:show
```

Migration files live in `src/migrations/`. **Never edit a migration file after it has been run** — create a new one instead.

---

## 6. Database — Seeds

Seeds insert initial/test data into the database. They are **idempotent** — safe to run multiple times without creating duplicates.

### Adding a new seed

**Step 1** — Create the seed file: `src/database/seeds/product.seed.ts`

```typescript
import { DataSource } from 'typeorm';
import { Product } from '../../modules/products/entities/product.entity';

const PRODUCTS = [
  { name: 'Fried Rice', price: 5.50, description: 'Served with vegetables' },
  { name: 'Chicken Soup', price: 4.00, description: 'Hot soup with rice' },
];

export async function seedProducts(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(Product);
  await repo.upsert(PRODUCTS, { conflictPaths: ['name'], skipUpdateIfNoValuesChanged: true });
  console.log(`  ✔ products seeded (${PRODUCTS.length} records)`);
}
```

**Step 2** — Register it in `src/database/seeds/run-seed.ts`:

```typescript
import { seedProducts } from './product.seed';

// inside runSeed():
await seedProducts(dataSource);
```

**Run seeds:**

```bash
pnpm seed
```

---

## 7. Caching with Redis

The project uses `@nestjs/cache-manager` with Redis. Inject `CACHE_MANAGER` into your service:

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  private readonly KEY_PREFIX = 'product:';
  private readonly KEY_LIST_VERSION = 'products:version';
  private readonly TTL_ITEM = 10 * 60 * 1000;  // 10 min
  private readonly TTL_LIST = 5 * 60 * 1000;   // 5 min
  private readonly TTL_VERSION = 24 * 60 * 60 * 1000; // 24 h

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}
}
```

### Always use the three resilient helpers

Copy these private methods into every service that uses caching. They ensure Redis failures never crash the app — a Redis error is treated as a cache miss.

```typescript
private async cacheGet<T = unknown>(key: string): Promise<T | null> {
  try {
    return (await this.cacheManager.get<T>(key)) ?? null;
  } catch {
    return null;
  }
}

private async cacheSet(key: string, value: unknown, ttl: number): Promise<void> {
  try {
    await this.cacheManager.set(key, value, ttl);
  } catch { /* ignore */ }
}

private async cacheDel(key: string): Promise<void> {
  try {
    await this.cacheManager.del(key);
  } catch { /* ignore */ }
}
```

### Cache key pattern

```
product:{id}              ← single record
products:list:v{n}:p{page}:l{limit}   ← paginated list
products:version          ← version counter for list invalidation
```

When you **create, update, or delete** a record:
1. Delete the item cache key: `await this.cacheDel('product:' + id)`
2. Bump the list version: `await this.invalidateListCache()`

This makes all existing list cache keys unreachable instantly without scanning Redis.

See `src/modules/categories/categories.service.ts` for the full working example.

---

## 8. How to Write Unit Tests

Every module needs two spec files:
- `<name>.service.spec.ts`
- `<name>.controller.spec.ts`

### Service test pattern

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import type { Cache } from 'cache-manager';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

// Factory — builds a fake entity for tests
function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-uuid-1',
    name: 'Fried Rice',
    price: 5.50,
    description: 'Served with vegetables',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepo: jest.Mocked<Pick<Repository<Product>, 'create' | 'save' | 'findOne' | 'findAndCount' | 'remove'>>;
  let cacheManager: jest.Mocked<Pick<Cache, 'get' | 'set' | 'del'>>;

  // beforeEach = fresh module for every test (NestJS docs pattern)
  beforeEach(async () => {
    productRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      remove: jest.fn(),
    };

    cacheManager = {
      get: jest.fn(),
      set: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: productRepo },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = moduleRef.get<ProductsService>(ProductsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findOne', () => {
    it('should throw NotFoundException when product does not exist', async () => {
      cacheManager.get.mockResolvedValue(null);
      productRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
```

### Controller test pattern

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{
        provide: ProductsService,
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
          remove: jest.fn(),
        },
      }],
    }).compile();

    controller = moduleRef.get<ProductsController>(ProductsController);
    service = moduleRef.get<ProductsService>(ProductsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return a paginated list', async () => {
      const result = { data: [], meta: { total: 0, page: 1, limit: 10 } };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll({ page: 1, limit: 10 })).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });
});
```

### Run tests

```bash
pnpm test              # run all tests
pnpm test:watch        # watch mode
pnpm test:cov          # with coverage report
```

---

## 9. Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | `development` | `development` or `production` |
| `PORT` | No | `3000` | HTTP port |
| `DATABASE_URL` | No | — | Full Postgres URL (overrides DB_* vars) |
| `DB_HOST` | Yes* | `localhost` | Postgres host |
| `DB_PORT` | Yes* | `5432` | Postgres port |
| `DB_USERNAME` | Yes* | `postgres` | Postgres user |
| `DB_PASSWORD` | Yes* | — | Postgres password |
| `DB_NAME` | Yes* | — | Database name |
| `JWT_SECRET` | **Yes** | — | Must be a long random string |
| `JWT_EXPIRES_IN` | No | `7d` | Token expiry |
| `REDIS_HOST` | No | `localhost` | Redis host |
| `REDIS_PORT` | No | `6379` | Redis port |
| `REDIS_PASSWORD` | No | — | Redis password (if auth enabled) |
| `CACHE_TTL` | No | `300` | Default cache TTL in seconds |
| `THROTTLE_TTL_MS` | No | `60000` | Rate limit window in ms |
| `THROTTLE_LIMIT_DEFAULT` | No | `100` | Max requests per window |
| `CORS_ALLOWED_ORIGINS` | No | *(all in dev)* | Comma-separated allowed origins |
| `TRUST_PROXY` | No | — | `true`, `false`, or a number |

*\* Required when `DATABASE_URL` is not set.*

---

## 10. Standard Response Envelope

Every API response is automatically wrapped in this shape by `ResponseInterceptor`:

**Success:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2026-06-04T14:10:20.595Z"
}
```

**Paginated list:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [ ... ],
  "timestamp": "2026-06-04T14:10:20.595Z",
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

**Validation error (400):**
```json
{
  "statusCode": 400,
  "message": "Bad Request Exception",
  "data": null,
  "timestamp": "...",
  "path": "/api/v1/products",
  "errors": [
    "name should not be empty",
    "price must be a positive number"
  ]
}
```

**Not found (404):**
```json
{
  "statusCode": 404,
  "message": "Product #abc not found",
  "data": null,
  "timestamp": "...",
  "path": "/api/v1/products/abc"
}
```

Your service just throws `new NotFoundException(...)` — the filter handles the rest automatically.

---

## 11. Common Mistakes to Avoid

### ❌ Never use `synchronize: true`
It will auto-modify your database schema and can destroy data. Always use migrations.

### ❌ Never skip the migration step
If you add a column to an entity and forget to run `pnpm migration:generate` + `pnpm migration:run`, the app will crash at runtime.

### ❌ Never use `npm install` or `yarn add`
Always use `pnpm add <package>`. Using npm/yarn will fail the preinstall check.

### ❌ Never return data directly from the controller without the standard shape
The `ResponseInterceptor` wraps your return value automatically. Just return the data from your service — do not manually wrap it.

```typescript
// ✅ correct
return this.productsService.findAll(query);

// ❌ wrong — double-wrapping
return { statusCode: 200, data: await this.productsService.findAll(query) };
```

### ❌ Never call cacheManager directly — always use the three helpers
If Redis goes down, a direct `cacheManager.get()` call will throw and crash the request. The `cacheGet`, `cacheSet`, `cacheDel` helpers catch errors and treat them as cache misses.

### ❌ Do not add fields to an existing migration file
Once a migration has been applied (`pnpm migration:run`), it is locked. Create a new migration instead.

### ✅ Always add Swagger decorators to controllers

```typescript
@ApiTags('Products')
@ApiOperation({ summary: 'List all products' })
@ApiResponse({ status: 200, description: 'OK' })
@ApiResponse({ status: 404, description: 'Not found' })
```

Swagger is the primary way other developers (and frontend) understand your API.

---

*For questions about the overall architecture, ask the backend lead.*
