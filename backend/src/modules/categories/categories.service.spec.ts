import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CacheService } from '../../common/services/cache.service';

// ─── Factory ──────────────────────────────────────────────────────────────────

function makeCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: 'cat-uuid-1',
    name: 'Breakfast',
    description: 'Morning meals',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepo: jest.Mocked<
    Pick<Repository<Category>, 'create' | 'save' | 'findOne' | 'findAndCount' | 'remove'>
  >;
  let cacheService: jest.Mocked<
    Pick<CacheService, 'get' | 'set' | 'del' | 'getVersion' | 'bumpVersion'>
  >;

  beforeEach(async () => {
    categoryRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      remove: jest.fn(),
    };

    cacheService = {
      get: jest.fn(),
      set: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
      getVersion: jest.fn().mockResolvedValue(1),
      bumpVersion: jest.fn().mockResolvedValue(undefined),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getRepositoryToken(Category), useValue: categoryRepo },
        { provide: CacheService, useValue: cacheService },
      ],
    }).compile();

    service = moduleRef.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── create ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and save a category then bump the list cache version', async () => {
      const dto = { name: 'Breakfast', description: 'Morning meals' };
      const entity = makeCategory(dto);
      categoryRepo.create.mockReturnValue(entity);
      categoryRepo.save.mockResolvedValue(entity);

      const result = await service.create(dto);

      expect(categoryRepo.create).toHaveBeenCalledWith(dto);
      expect(categoryRepo.save).toHaveBeenCalledWith(entity);
      expect(result.id).toBe('cat-uuid-1');
      expect(cacheService.bumpVersion).toHaveBeenCalledTimes(1);
    });

    it('should propagate database errors on save', async () => {
      categoryRepo.create.mockReturnValue(makeCategory());
      categoryRepo.save.mockRejectedValue(new Error('db write failed'));

      await expect(service.create({ name: 'Breakfast' })).rejects.toThrow('db write failed');
    });
  });

  // ── findAll ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    describe('cache behaviour', () => {
      it('should query DB and cache the result on cache MISS', async () => {
        cacheService.get.mockResolvedValue(null);
        categoryRepo.findAndCount.mockResolvedValue([[makeCategory()], 1]);

        const result = await service.findAll({ page: 1, limit: 10 });

        expect(result.data).toHaveLength(1);
        expect(result.meta).toEqual({ total: 1, page: 1, limit: 10 });
        expect(categoryRepo.findAndCount).toHaveBeenCalledTimes(1);
        expect(cacheService.set).toHaveBeenCalledTimes(1);
      });

      it('should return cached value without touching DB on cache HIT', async () => {
        const cached = { data: [makeCategory()], meta: { total: 1, page: 1, limit: 10 } };
        cacheService.getVersion.mockResolvedValue(3);
        cacheService.get.mockResolvedValue(cached);

        const result = await service.findAll({ page: 1, limit: 10 });

        expect(result).toBe(cached);
        expect(categoryRepo.findAndCount).not.toHaveBeenCalled();
        expect(cacheService.set).not.toHaveBeenCalled();
      });

      it('should fall back to DB when cache returns null (Redis unavailable scenario)', async () => {
        // CacheService.get() catches Redis errors and returns null — never rejects
        cacheService.get.mockResolvedValue(null);
        categoryRepo.findAndCount.mockResolvedValue([[makeCategory()], 1]);

        const result = await service.findAll({ page: 1, limit: 10 });

        expect(result.data).toHaveLength(1);
      });

      it('should still return DB result when cache SET fails silently', async () => {
        // CacheService.set() swallows errors — never rejects from the caller's perspective
        cacheService.get.mockResolvedValue(null);
        categoryRepo.findAndCount.mockResolvedValue([[makeCategory()], 1]);

        await expect(service.findAll({ page: 1, limit: 10 })).resolves.toBeDefined();
      });

      it('should cache the list with a 5-min TTL', async () => {
        cacheService.get.mockResolvedValue(null);
        categoryRepo.findAndCount.mockResolvedValue([[makeCategory()], 1]);

        await service.findAll({ page: 1, limit: 10 });

        const [, , ttl] = (cacheService.set as jest.Mock).mock.calls[0] as [
          string,
          unknown,
          number,
        ];
        expect(ttl).toBe(5 * 60 * 1000);
      });

      it('should embed the version number in the cache key', async () => {
        cacheService.getVersion.mockResolvedValue(7);
        cacheService.get.mockResolvedValue(null);
        categoryRepo.findAndCount.mockResolvedValue([[makeCategory()], 1]);

        await service.findAll({ page: 1, limit: 10 });

        const [cacheKey] = (cacheService.set as jest.Mock).mock.calls[0] as [string, ...unknown[]];
        expect(cacheKey).toContain('v7');
      });
    });

    describe('pagination', () => {
      it('should default to page=1 and limit=10 when not provided', async () => {
        cacheService.get.mockResolvedValue(null);
        categoryRepo.findAndCount.mockResolvedValue([[makeCategory()], 1]);

        const result = await service.findAll({});

        expect(categoryRepo.findAndCount).toHaveBeenCalledWith(
          expect.objectContaining({ skip: 0, take: 10 }),
        );
        expect(result.meta.page).toBe(1);
        expect(result.meta.limit).toBe(10);
      });

      it('should compute the correct skip offset for page 3 limit 5', async () => {
        cacheService.get.mockResolvedValue(null);
        categoryRepo.findAndCount.mockResolvedValue([[], 20]);

        await service.findAll({ page: 3, limit: 5 });

        expect(categoryRepo.findAndCount).toHaveBeenCalledWith(
          expect.objectContaining({ skip: 10, take: 5 }),
        );
      });

      it('should return an empty data array when no categories exist', async () => {
        cacheService.get.mockResolvedValue(null);
        categoryRepo.findAndCount.mockResolvedValue([[], 0]);

        const result = await service.findAll({ page: 1, limit: 10 });

        expect(result.data).toHaveLength(0);
        expect(result.meta.total).toBe(0);
      });
    });
  });

  // ── findOne ────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should fetch from DB and cache with 10-min TTL on cache MISS', async () => {
      cacheService.get.mockResolvedValue(null);
      categoryRepo.findOne.mockResolvedValue(makeCategory());

      const result = await service.findOne('cat-uuid-1');

      expect(result.id).toBe('cat-uuid-1');
      expect(categoryRepo.findOne).toHaveBeenCalledWith({ where: { id: 'cat-uuid-1' } });
      const [, , ttl] = (cacheService.set as jest.Mock).mock.calls[0] as [string, unknown, number];
      expect(ttl).toBe(10 * 60 * 1000);
    });

    it('should return cached value without querying DB on cache HIT', async () => {
      const cached = makeCategory();
      cacheService.get.mockResolvedValue(cached);

      const result = await service.findOne('cat-uuid-1');

      expect(result).toBe(cached);
      expect(categoryRepo.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when category does not exist', async () => {
      cacheService.get.mockResolvedValue(null);
      categoryRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });

    it('should fall back to DB when cache returns null (Redis unavailable scenario)', async () => {
      // CacheService.get() catches Redis errors and returns null — never rejects
      cacheService.get.mockResolvedValue(null);
      categoryRepo.findOne.mockResolvedValue(makeCategory());

      const result = await service.findOne('cat-uuid-1');

      expect(result.id).toBe('cat-uuid-1');
    });

    it('should still return the record when cache SET fails silently', async () => {
      // CacheService.set() swallows errors — never rejects from the caller's perspective
      cacheService.get.mockResolvedValue(null);
      categoryRepo.findOne.mockResolvedValue(makeCategory());

      await expect(service.findOne('cat-uuid-1')).resolves.toBeDefined();
    });
  });

  // ── update ─────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update fields, delete item cache and bump list version', async () => {
      categoryRepo.findOne.mockResolvedValue(makeCategory());
      categoryRepo.save.mockResolvedValue(makeCategory({ name: 'Lunch' }));
      cacheService.get.mockResolvedValue(null);

      const result = await service.update('cat-uuid-1', { name: 'Lunch' });

      expect(categoryRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'cat-uuid-1', name: 'Lunch' }),
      );
      expect(result.name).toBe('Lunch');
      expect(cacheService.del).toHaveBeenCalledWith('category:cat-uuid-1');
      expect(cacheService.bumpVersion).toHaveBeenCalledTimes(1);
    });

    it('should keep original data when the update dto is empty', async () => {
      categoryRepo.findOne.mockResolvedValue(makeCategory({ name: 'Breakfast' }));
      categoryRepo.save.mockResolvedValue(makeCategory({ name: 'Breakfast' }));
      cacheService.get.mockResolvedValue(null);

      const result = await service.update('cat-uuid-1', {});

      expect(result.name).toBe('Breakfast');
    });

    it('should throw NotFoundException when category does not exist', async () => {
      cacheService.get.mockResolvedValue(null);
      categoryRepo.findOne.mockResolvedValue(null);

      await expect(service.update('missing', { name: 'Lunch' })).rejects.toThrow(NotFoundException);
      expect(categoryRepo.save).not.toHaveBeenCalled();
    });
  });

  // ── remove ─────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should remove category, delete item cache and bump list version', async () => {
      const category = makeCategory();
      categoryRepo.findOne.mockResolvedValue(category);
      categoryRepo.remove.mockResolvedValue(category);
      cacheService.get.mockResolvedValue(null);

      await service.remove('cat-uuid-1');

      expect(categoryRepo.remove).toHaveBeenCalledWith(category);
      expect(cacheService.del).toHaveBeenCalledWith('category:cat-uuid-1');
      expect(cacheService.bumpVersion).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when category does not exist', async () => {
      cacheService.get.mockResolvedValue(null);
      categoryRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
      expect(categoryRepo.remove).not.toHaveBeenCalled();
    });

    it('should complete when cache DEL fails silently (CacheService swallows the error)', async () => {
      // CacheService.del() swallows errors — never rejects from the caller's perspective
      categoryRepo.findOne.mockResolvedValue(makeCategory());
      categoryRepo.remove.mockResolvedValue(makeCategory());
      cacheService.get.mockResolvedValue(null);

      await expect(service.remove('cat-uuid-1')).resolves.toBeUndefined();
    });
  });
});
