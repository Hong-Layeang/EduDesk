import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

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

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<CategoriesController>(CategoriesController);
    service = moduleRef.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── create ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should forward dto to service and return the created category', async () => {
      const dto = { name: 'Breakfast', description: 'Morning meals' };
      jest.spyOn(service, 'create').mockResolvedValue(makeCategory(dto));

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('cat-uuid-1');
      expect(result.name).toBe('Breakfast');
    });

    it('should propagate service errors', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new Error('db error'));

      await expect(controller.create({ name: 'Breakfast' })).rejects.toThrow('db error');
    });
  });

  // ── findAll ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return a paginated list of categories', async () => {
      const paginated = { data: [makeCategory()], meta: { total: 1, page: 1, limit: 10 } };
      jest.spyOn(service, 'findAll').mockResolvedValue(paginated);

      const result = await controller.findAll({ page: 1, limit: 10 });

      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should return an empty list when no categories exist', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 10 },
      });

      const result = await controller.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(0);
    });
  });

  // ── findOne ────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should forward id to service and return the category', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(makeCategory());

      const result = await controller.findOne('cat-uuid-1');

      expect(service.findOne).toHaveBeenCalledWith('cat-uuid-1');
      expect(result.id).toBe('cat-uuid-1');
    });

    it('should propagate NotFoundException from service', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Category #missing not found'));

      await expect(controller.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  // ── update ─────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should forward id and dto to service and return the updated category', async () => {
      const dto = { name: 'Lunch' };
      jest.spyOn(service, 'update').mockResolvedValue(makeCategory({ name: 'Lunch' }));

      const result = await controller.update('cat-uuid-1', dto);

      expect(service.update).toHaveBeenCalledWith('cat-uuid-1', dto);
      expect(result.name).toBe('Lunch');
    });

    it('should propagate NotFoundException when category does not exist', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new NotFoundException('Category #missing not found'));

      await expect(controller.update('missing', { name: 'Lunch' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── remove ─────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should forward id to service', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('cat-uuid-1');

      expect(service.remove).toHaveBeenCalledWith('cat-uuid-1');
    });

    it('should propagate NotFoundException when category does not exist', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new NotFoundException('Category #missing not found'));

      await expect(controller.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
